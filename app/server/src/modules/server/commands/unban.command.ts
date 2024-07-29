import {
  getUsersConfig,
  writeUserConfig,
} from "../../../shared/utils/users.utils.ts";

export const unbanCommand = {
  command: "unban",
  func: async ({ args }) => {
    const user = args[0];
    if (!user) return;

    const config = await getUsersConfig();
    config.blacklist.users = config.blacklist.users.filter((u) => u !== user);

    await writeUserConfig(config);
  },
};
