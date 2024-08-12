import { __, getUsersConfig, writeUserConfig } from "shared/utils/main.ts";
import { Command } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";

export const opCommand: Command = {
  command: "op",
  func: async ({ user, args }) => {
    const username = args[0] as string;
    if (!username) return;

    const config = await getUsersConfig();
    if (config.op.users.includes(username)) {
      user.emit(ProxyEvent.SYSTEM_MESSAGE, {
        message: __(user.getLanguage(), "User {{username}} was already op", {
          username,
        }),
      });
      return;
    }
    config.op.users.push(username);

    await writeUserConfig(config);

    user.emit(ProxyEvent.SYSTEM_MESSAGE, {
      message: __(user.getLanguage(), "User {{username}} is now op", {
        username,
      }),
    });
  },
};
