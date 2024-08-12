import { __, getUsersConfig, writeUserConfig } from "shared/utils/main.ts";
import { Command } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";

export const deopCommand: Command = {
  command: "deop",
  func: async ({ user, args }) => {
    const username = args[0] as string;
    if (!username) return;

    const config = await getUsersConfig();
    config.op.users = config.op.users.filter((u) => u !== username);

    await writeUserConfig(config);

    user.emit(ProxyEvent.SYSTEM_MESSAGE, {
      message: __(user.getLanguage(), "User {{username}} is no longer op", {
        username,
      }),
    });
  },
};
