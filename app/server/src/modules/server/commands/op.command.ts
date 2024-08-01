import { getUsersConfig, writeUserConfig } from "shared/utils/users.utils.ts";
import { Command } from "shared/types/main.ts";

export const opCommand: Command = {
  command: "op",
  func: async ({ args }) => {
    const user = args[0] as string;
    if (!user) return;

    const config = await getUsersConfig();
    if (config.op.users.includes(user)) return;
    config.op.users.push(user);

    await writeUserConfig(config);
  },
};
