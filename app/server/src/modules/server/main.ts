import { ModuleProps } from "shared/types/main.ts";
import { getServerSocket } from "socket_ionic";
import { getVersion, initLog, log, wait } from "shared/utils/main.ts";

type User = {
  userId: string;
  username: string;
};

export const load = async (args: ModuleProps) => {
  await wait(0);
  initLog("SERVER");
  log("Open Hotel Started!");
  log(`Version ${getVersion()}`);

  const server = getServerSocket(args.internal.serverPort);
  let proxyClient;

  let userList: User[] = [];

  setInterval(() => {
    const users = userList.length;
    if (!users) return;

    log(`Current users ${users}/-1`);
  }, 5_000);

  server.on(
    "guest",
    (clientId: string, [clientToken]) =>
      !proxyClient && clientToken === args.internal.token,
  );
  server.on("connected", (client) => {
    log(">->-> Proxy");
    proxyClient = client;

    proxyClient.on("joined", ({ userId, username }) => {
      log(`${username} has joined!`);
      userList.push({ userId, username });
    });
    proxyClient.on("left", ({ userId, username }) => {
      log(`${username} left!`);
      userList = userList.filter((user) => user.userId !== userId);
    });
    proxyClient.on("data", async ({ username, event, message }) => {
      log(username, event, message);
    });
  });
  server.on("disconnected", (proxyClient) => {
    log("-/ /- Proxy");
  });
};
