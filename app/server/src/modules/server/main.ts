import { ConfigTypes } from "shared/types/main.ts";
import { debug, initLog, log } from "shared/utils/main.ts";
import InputLoop from "input";

type User = {
  userId: string;
  username: string;
};

export const load = async (config: ConfigTypes, proxyWorker) => {
  log("server");
  // if(false) {
  //   let proxyClient;
  //
  //   let userList: User[] = [];
  //
  //   // setInterval(() => {
  //   //   const users = userList.length;
  //   //   if (!users) return;
  //   //
  //   //   log(`Current users ${users}/-1`);
  //   // }, 5_000);
  //
  //   const onReady = async () => {
  //     log("Welcome to Open Hotel!");
  //     log(`Running on :${config.ports.client}`);
  //
  //     setInterval(() => {
  //       log("Server here and alive!");
  //     }, 2000);
  //     const input = new InputLoop({ silent: true });
  //     log("!help");
  //     while (!input.done) {
  //       const result = await input.question("something");
  //
  //       log(result);
  //     }
  //   };
  //   const onDisconnected = () => {
  //     log("Server disconnected! (!)");
  //   };
  //
  //   server.on(
  //     "guest",
  //     (clientId: string, [clientToken]) =>
  //       !proxyClient && clientToken === args.internal.token,
  //   );
  //   server.on("connected", (client) => {
  //     proxyClient = client;
  //
  //     proxyClient.on("ready", onReady);
  //
  //     proxyClient.on("joined", ({ userId, username }) => {
  //       log(`${username} has joined!`);
  //       userList.push({ userId, username });
  //     });
  //     proxyClient.on("left", ({ userId, username }) => {
  //       log(`${username} left!`);
  //       userList = userList.filter((user) => user.userId !== userId);
  //     });
  //     proxyClient.on("data", async ({ username, event, message }) => {
  //       log(username, event, message);
  //     });
  //     proxyClient.on("disconnected", (error) => {
  //       proxyClient = undefined;
  //       debug("server client disconnected", error);
  //       onDisconnected();
  //     });
  //   });
  //   server.on("disconnected", () => {
  //     onDisconnected();
  //   });
  // }
};
