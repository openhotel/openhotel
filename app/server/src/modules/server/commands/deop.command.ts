import { getUsersConfig, writeUserConfig } from "shared/utils/users.utils.ts";

export const deopCommand = {
  command: "deop",
  func: async ({ args }) => {
    const user = args[0];
    if (!user) return;

    const config = await getUsersConfig();
    config.op.users = config.op.users.filter((u) => u !== user);

    await writeUserConfig(config);
  },
};
