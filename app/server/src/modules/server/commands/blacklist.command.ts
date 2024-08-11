import { getUsersConfig, writeUserConfig } from "shared/utils/users.utils.ts";
import {
  Command,
  ListActions,
  UserMutable,
  UsersConfig,
} from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";

const on = (config: UsersConfig, _: string[], user: UserMutable) => {
  config.blacklist.active = true;
  user.emit(ProxyEvent.SYSTEM_MESSAGE, {
    message: "Blacklist enabled",
  });
  return config;
};
const off = (config: UsersConfig, _: string[], user: UserMutable) => {
  config.blacklist.active = false;
  user.emit(ProxyEvent.SYSTEM_MESSAGE, {
    message: "Blacklist disabled",
  });
  return config;
};
const add = (config: UsersConfig, args: string[], user: UserMutable) => {
  const username = args[0];
  if (config.blacklist.users.includes(username)) return config;

  config.blacklist.users.push(username);
  user.emit(ProxyEvent.SYSTEM_MESSAGE, {
    message: `User ${username} added to blacklist`,
  });
  return config;
};
const remove = (config: UsersConfig, args: string[], user: UserMutable) => {
  const username = args[0];
  config.blacklist.users = config.blacklist.users.filter((u) => u !== username);
  user.emit(ProxyEvent.SYSTEM_MESSAGE, {
    message: `User ${username} removed from blacklist`,
  });
  return config;
};
const list = (config: UsersConfig, _: string[], user: UserMutable) => {
  user.emit(ProxyEvent.SYSTEM_MESSAGE, {
    message:
      config.blacklist.users.join(", ") || "There is no users on the blacklist",
  });
  return config;
};

export const blacklistCommand: Command = {
  command: "blacklist",
  func: async ({ user, args }) => {
    const action = args[0] as ListActions;
    if (!action) return;

    const command = {
      on,
      off,
      add,
      remove,
      list,
    }[action];

    if (!command) return;

    const config = await getUsersConfig();
    args.shift();
    command(config, args as string[], user);

    await writeUserConfig(config);
  },
};
