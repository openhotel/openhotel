import { getUsersConfig, writeUserConfig } from "shared/utils/users.utils.ts";
import { Server } from "../main.ts";
import { Command } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";

export const banCommand: Command = {
  command: "ban",
  func: async ({ user, args }) => {
    const username = args[0] as string;
    if (!username) return;

    const config = await getUsersConfig();
    if (config.blacklist.users.includes(username)) return;
    config.blacklist.users.push(username);

    await writeUserConfig(config);

    const bannedUser = Server.game.users.get({ username });
    if (!bannedUser) return;

    bannedUser.disconnect();
    user.emit(ProxyEvent.SYSTEM_MESSAGE, {
      message: `User ${username} has been banned`,
    });
  },
};
