import { getUsersConfig, writeUserConfig } from "shared/utils/users.utils.ts";
import { Server } from "../main.ts";
import { Command } from "shared/types/main.ts";

export const banCommand: Command = {
  command: "ban",
  func: async ({ args }) => {
    const username = args[0] as string;
    if (!username) return;

    const config = await getUsersConfig();
    if (config.blacklist.users.includes(username)) return;
    config.blacklist.users.push(username);

    await writeUserConfig(config);

    const user = Server.game.users.get({ username });
    if (!user) return;

    user.disconnect();
  },
};
