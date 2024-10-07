import { __ } from "shared/utils/main.ts";
import { System } from "../main.ts";
import { Command } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";

export const banCommand: Command = {
  command: "ban",
  func: async ({ user, args }) => {
    const username = args[0] as string;
    if (!username) return;

    const config = await System.game.users.getConfig();
    if (config.blacklist.users.includes(username)) return;
    config.blacklist.users.push(username);

    await System.game.users.setConfig(config);

    const bannedUser = System.game.users.get({ username });
    if (!bannedUser) return;

    bannedUser.disconnect();
    user.emit(ProxyEvent.SYSTEM_MESSAGE, {
      message: __(user.getLanguage())("User {{username}} has been banned", {
        username,
      }),
    });
  },
};
