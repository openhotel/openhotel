import { getUsersConfig, writeUserConfig } from "shared/utils/users.utils.ts";
import { Command } from "shared/types/main.ts";

export const unbanCommand: Command = {
  command: "unban",
  func: async ({ args }) => {
    const user = args[0] as string;
    if (!user) return;

    const config = await getUsersConfig();
    config.blacklist.users = config.blacklist.users.filter((u) => u !== user);

    await writeUserConfig(config);
  },
};
