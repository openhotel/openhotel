import { ConfigTypes, Envs, User } from "shared/types/main.ts";
import { debug, initLog, log } from "shared/utils/main.ts";
import InputLoop from "input";
import { Event } from "shared/enums/main.ts";

export const load = async (config: ConfigTypes, envs: Envs, proxyWorker) => {
  log("server");

  proxyWorker.on("joined", ({ username }: User) => {
    log(`${username} joined!`);
  });
  proxyWorker.on("left", ({ username }: User) => {
    log(`${username} left!`);
  });
  proxyWorker.on(
    "data",
    ({ user, event, message }: { user: User; event: Event; message: any }) => {
      log(user.username, event, message);
    },
  );
};
