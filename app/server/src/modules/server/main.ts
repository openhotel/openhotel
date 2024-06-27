import { ModuleProps } from "shared/types/main.ts";
import { getServerSocket } from "socket_ionic";
import { wait } from "shared/utils/main.ts";

type User = {
  userId: string;
  username: string;
};

export const load = async (args: ModuleProps) => {
  await wait(0);
  console.log(`「OH SERVER」 Hello there!`);

  const server = getServerSocket(args.internal.serverPort);
  let proxyClient;

  let userList: User[] = [];

  setInterval(() => {
    const users = userList.length;
    if (!users) return;

    console.log("「OH SERVER」", `Current users ${users}/-1`);
  }, 5_000);

  server.on(
    "guest",
    (clientId: string, [clientToken]) =>
      !proxyClient && clientToken === args.internal.token,
  );
  server.on("connected", (client) => {
    console.log("「OH SERVER」", ">->-> Proxy");
    proxyClient = client;

    proxyClient.on("joined", ({ userId, username }) => {
      console.log(`「OH SERVER」 ${username} has joined!`);
      userList.push({ userId, username });
    });
    proxyClient.on("left", ({ userId, username }) => {
      console.log(`「OH SERVER」 ${username} left!`);
      userList = userList.filter((user) => user.userId !== userId);
    });
    proxyClient.on("data", async ({ username, event, message }) => {
      console.log("「OH SERVER」", username, event, message);
    });
  });
  server.on("disconnected", (proxyClient) => {
    console.log("「OH SERVER」", "-/ /- Proxy");
  });
};
