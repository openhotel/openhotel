import { getUsersConfig, writeUserConfig } from "shared/utils/users.utils.ts";

export const opCommand = {
  command: "op",
  func: async ({ args }) => {
    const user = args[0];
    if (!user) return;

    const config = await getUsersConfig();
    if (config.op.users.includes(user)) return;
    config.op.users.push(user);

    await writeUserConfig(config);
  },
};
