import { getUsersConfig, writeUserConfig } from "shared/utils/users.utils.ts";
import { Server } from "../main.ts";

export const banCommand = {
  command: "ban",
  func: async ({ args }) => {
    const username = args[0];
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
