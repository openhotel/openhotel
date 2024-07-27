import { getRandomString, initLog, log, waitUntil } from "shared/utils/main.ts";
import { getChildWorker, getParentWorker } from "worker_ionic";
import { User, WorkerProps } from "shared/types/main.ts";
import { getServerSocket, ServerClient } from "socket_ionic";
import { PROXY_CLIENT_EVENT_WHITELIST } from "shared/consts/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";

initLog();
const serverWorker = getChildWorker();

// This maps client id to user id (1:1), to prevent the connection of the user multiple times
// The userId cannot be duplicated as value, if so, it would be the same user connected twice
let clientIdUserIdMap: Record<string, string> = {};
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
    userClientMap[user?.clientId]?.emit(event, message);
});

serverWorker.on(ProxyEvent.$ADD_ROOM, ({ roomId, userId }) => {
  const user = userList.find((user) => user.id === userId);
  if (!user) return;
  server.getRoom(roomId).addClient(user.clientId);
});

serverWorker.on(ProxyEvent.$REMOVE_ROOM, ({ roomId, userId }) => {
  const user = userList.find((user) => user.id === userId);
  if (!user) return;
  server.getRoom(roomId).removeClient(user.clientId);
});

serverWorker.on(ProxyEvent.$ROOM_DATA, ({ roomId, event, message }) => {
  server.getRoom(roomId).emit(event, message);
});
serverWorker.on(ProxyEvent.$DISCONNECT, ({ clientId }) => {
  userClientMap[clientId]?.close();
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
    const foundUser = userList.find((user) => user.id === userId);

    if (foundUser) {
      foundUser.session = session;
    } else {
      userList.push({ session, id: userId, username });
      firewallWorker.emit("userList", { userList });
    }

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
    const foundUser = userList.find((user) => user.session === session);
    if (!foundUser) return false;

    // Disconnects user if already connected
    if (foundUser.clientId) userClientMap[foundUser.clientId]?.close();

    // Assigns the new clientId
    foundUser.clientId = clientId;
    return true;
  });
  server.on("connected", async (client: ServerClient) => {
    const foundUser = userList.find((user) => user.clientId === client.id);
    if (!foundUser) return client.close();

    // Wait if current user is connected to be disconnected
    await waitUntil(
      () => !Object.values(clientIdUserIdMap).includes(foundUser.id),
    );
    // Assign the userId to the clientId. UserId can only be once as value.
    clientIdUserIdMap[client.id] = foundUser.id;

    userClientMap[foundUser.clientId] = client;
    serverWorker.emit(ProxyEvent.$JOINED, foundUser);

    client.on(ProxyEvent.$DATA, ({ event, message }) => {
      // Disconnect client if tries to send events outside the whitelist
      if (!PROXY_CLIENT_EVENT_WHITELIST.includes(event)) return client.close();
      serverWorker.emit(ProxyEvent.$DATA, { user: foundUser, event, message });
    });
    client.emit(ProxyEvent.WELCOME, { datetime: Date.now() });
  });
  server.on("disconnected", (client: ServerClient) => {
    const userId = clientIdUserIdMap[client.id];

    const foundUser = userList.find((user) => user.id === userId);

    delete userClientMap[client.id];
    delete clientIdUserIdMap[client.id];

    userList = userList.filter((user) => user.clientId !== client.id);
    firewallWorker.emit("userList", { userList });

    serverWorker.emit(ProxyEvent.$LEFT, foundUser);
  });
  log(`Proxy started on :${config.proxy.port}`);
});
