import { getUsersConfig, writeUserConfig } from "shared/utils/users.utils.ts";
import { Command } from "shared/types/main.ts";

export const deopCommand: Command = {
  command: "deop",
  func: async ({ args }) => {
    const user = args[0] as string;
    if (!user) return;

    const config = await getUsersConfig();
    config.op.users = config.op.users.filter((u) => u !== user);

    await writeUserConfig(config);
  },
};
