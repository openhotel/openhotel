import { ConfigTypes, Envs, User } from "shared/types/main.ts";
import { log } from "shared/utils/main.ts";
import { Event } from "shared/enums/main.ts";

export const load = async (config: ConfigTypes, envs: Envs, proxyWorker) => {
  log("server");

  let userList: User[] = [];
  const logs: string[] = [];

  const broadcast = (message: string) => {
    log(message);
    logs.push(message);

    proxyWorker.emit("data", {
      users: ["*"],
      event: "log",
      message: { log: message },
    });
  };

  proxyWorker.on("joined", (user: User) => {
    userList.push(user);
    broadcast(`${user.username} joined!`);

    proxyWorker.emit("data", {
      users: [user.clientId],
      event: "logs",
      message: { logs },
    });
  });
  proxyWorker.on("left", ({ username, userId }: User) => {
    userList = userList.filter((user) => user.userId !== userId);
    broadcast(`${username} left!`);
  });
  proxyWorker.on(
    "data",
    ({ user, event, message }: { user: User; event: Event; message: any }) => {
      log(user.username, event, message);
    },
  );
};
