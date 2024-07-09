import { getRandomString, initLog, log } from "shared/utils/main.ts";
import { getChildWorker, getParentWorker } from "worker_ionic";
import { User, WorkerProps } from "shared/types/main.ts";
import { getServerSocket, ServerClient } from "socket_ionic";
import { PROXY_CLIENT_EVENT_WHITELIST } from "shared/consts/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";

initLog();
const serverWorker = getChildWorker();

let userList: User[] = [];
let userClientMap: Record<string, ServerClient> = {};

let server;

type DataEvent = {
  users: string[];
  event: string;
  message: object;
};

serverWorker.on(ProxyEvent.$DATA, ({ users, event, message }: DataEvent) => {
  // broadcast
  if (users.includes("*")) return server.emit(event, message);
  //
  for (const user of users.map((userId) =>
    userList.find((user) => user.id === userId),
  ))
    userClientMap[user.clientId].emit(event, message);
});

serverWorker.on(ProxyEvent.$ADD_ROOM, ({ roomId, userId }) => {
  const { clientId } = userList.find((user) => user.id === userId);
  server.getRoom(roomId).addClient(clientId);
});

serverWorker.on(ProxyEvent.$REMOVE_ROOM, ({ roomId, userId }) => {
  const { clientId } = userList.find((user) => user.id === userId);
  server.getRoom(roomId).removeClient(clientId);
});

serverWorker.on(ProxyEvent.$ROOM_DATA, ({ roomId, event, message }) => {
  server.getRoom(roomId).emit(event, message);
});

serverWorker.on("start", async ({ config, envs }: WorkerProps) => {
  const protocolToken = getRandomString(64);

  const firewallWorker = getParentWorker({
    url: new URL("../firewall/firewall.worker.ts", import.meta.url).href,
  });
  firewallWorker.emit("start", {
    config,
    envs,
    token: protocolToken,
  } as WorkerProps);
  firewallWorker.on("join", ({ session, userId, username }) => {
    userList.push({ session, id: userId, username });
    firewallWorker.emit("userList", { userList });

    setTimeout(() => {
      userList = userList.filter(
        (user) => !(!user.clientId && user.session === session),
      );
      firewallWorker.emit("userList", { userList });
    }, 5_000);
  });

  server = getServerSocket(
    config.proxy.port,
    (request: Request) => new Response("404", { status: 404 }),
  );

  server.on("guest", (clientId: string, [token, session]) => {
    if (token !== protocolToken && userList.length >= config.limits.players)
      return false;
    const foundUser = userList.find(
      (user) => !user.clientId && user.session === session,
    );
    if (!foundUser) return false;
    foundUser.clientId = clientId;
    return true;
  });
  server.on("connected", (client: ServerClient) => {
    const foundUser = userList.find((user) => user.clientId === client.id);
    if (!foundUser) return client.close();

    userClientMap[foundUser.clientId] = client;
    serverWorker.emit(ProxyEvent.$JOINED, foundUser);

    client.on(ProxyEvent.$DATA, ({ event, message }) => {
      // Disconnect client if tries to send events outside the whitelist
      if (!PROXY_CLIENT_EVENT_WHITELIST.includes(event)) return client.close();
      serverWorker.emit(ProxyEvent.$DATA, { user: foundUser, event, message });
    });
  });
  server.on("disconnected", (client: ServerClient) => {
    const foundUser = userList.find((user) => user.clientId === client.id);

    delete userClientMap[foundUser.clientId];
    userList = userList.filter((user) => user.clientId !== client.id);
    firewallWorker.emit("userList", { userList });

    serverWorker.emit(ProxyEvent.$LEFT, foundUser);
  });
  log(`Proxy started on :${config.proxy.port}`);
});
