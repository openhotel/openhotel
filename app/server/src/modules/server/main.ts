import { ConfigTypes, ModuleProps } from "shared/types/main.ts";
import { getServerSocket } from "socket_ionic";
import { debug, initLog, log, wait } from "shared/utils/main.ts";
import InputLoop from "input";

type User = {
  userId: string;
  username: string;
};

export const load = async (args: ModuleProps, config: ConfigTypes) => {
  await wait(0);
  initLog();

  const server = getServerSocket(args.internal.serverPort);
  let proxyClient;
  log(`:${args.internal.serverPort}`, "server");

  let userList: User[] = [];

  // setInterval(() => {
  //   const users = userList.length;
  //   if (!users) return;
  //
  //   log(`Current users ${users}/-1`);
  // }, 5_000);

  const onReady = async () => {
    log("Welcome to Open Hotel!");
    log(`Running on :${config.ports.client}`);

    setInterval(() => {
      console.log("Server here and alive!");
    }, 2000);
    // const input = new InputLoop({ silent: true });
    // log("!help");
    // while (!input.done) {
    //   const result = await input.question("something");
    //
    //   log(result);
    // }
  };
  const onDisconnected = () => {
    log("Server disconnected! (!)");
  };

  server.on(
    "guest",
    (clientId: string, [clientToken]) =>
      !proxyClient && clientToken === args.internal.token,
  );
  server.on("connected", (client) => {
    proxyClient = client;

    proxyClient.on("ready", onReady);

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
    proxyClient.on("disconnected", (error) => {
      proxyClient = undefined;
      debug("server client disconnected", error);
      onDisconnected();
    });
  });
  server.on("disconnected", () => {
    onDisconnected();
  });
};
