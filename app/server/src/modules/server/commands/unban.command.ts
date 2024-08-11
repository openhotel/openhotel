import { getUsersConfig, writeUserConfig } from "shared/utils/main.ts";
import { Command } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";

export const unbanCommand: Command = {
  command: "unban",
  func: async ({ user, args }) => {
    const username = args[0] as string;
    if (!username) return;

    const config = await getUsersConfig();
    config.blacklist.users = config.blacklist.users.filter(
      (u) => u !== username,
    );

    await writeUserConfig(config);

    user.emit(ProxyEvent.SYSTEM_MESSAGE, {
      message: `User ${username} has been unbanned`,
    });
  },
};
