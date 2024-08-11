import { getUsersConfig, writeUserConfig } from "shared/utils/main.ts";
import { Command } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";

export const deopCommand: Command = {
  command: "deop",
  func: async ({ user, args }) => {
    const opUser = args[0] as string;
    if (!opUser) return;

    const config = await getUsersConfig();
    config.op.users = config.op.users.filter((u) => u !== opUser);

    await writeUserConfig(config);

    user.emit(ProxyEvent.SYSTEM_MESSAGE, {
      message: `User ${opUser} is no longer op`,
    });
  },
};
