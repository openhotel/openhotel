import { __ } from "shared/utils/main.ts";
import { Command } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";
import { System } from "modules/system/main.ts";

export const opCommand: Command = {
  command: "op",
  func: async ({ user, args }) => {
    const username = args[0] as string;
    if (!username) return;

    const config = await System.game.users.getConfig();
    if (config.op.users.includes(username)) {
      user.emit(ProxyEvent.SYSTEM_MESSAGE, {
        message: __(user.getLanguage(), "User {{username}} was already op", {
          username,
        }),
      });
      return;
    }
    config.op.users.push(username);

    await System.game.users.setConfig(config);

    user.emit(ProxyEvent.SYSTEM_MESSAGE, {
      message: __(user.getLanguage(), "User {{username}} is now op", {
        username,
      }),
    });
  },
};
