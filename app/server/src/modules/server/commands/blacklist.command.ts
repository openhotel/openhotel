import {
  getUsersConfig,
  writeUserConfig,
} from "../../../shared/utils/users.utils.ts";
import { ListActions, UsersConfig } from "../../../shared/types/main.ts";

const on = (config: UsersConfig) => {
  config.blacklist.active = true;
  return config;
};
const off = (config: UsersConfig) => {
  config.blacklist.active = false;
  return config;
};
const add = (config: UsersConfig, args: string) => {
  const user = args[0];
  config.blacklist.users.push(user);
  return config;
};
const remove = (config: UsersConfig, args: string) => {
  const user = args[0];
  config.blacklist.users = config.blacklist.users.filter((u) => u !== user);
  return config;
};

export const blacklistCommand = {
  command: "blacklist",
  func: async ({ args }) => {
    const action: ListActions = args[0];
    if (!action) return;

    const command = {
      on,
      off,
      add,
      remove,
    }[action];

    if (!command) return;

    const config = await getUsersConfig();
    args.shift();
    command(config, args);

    await writeUserConfig(config);
  },
};
