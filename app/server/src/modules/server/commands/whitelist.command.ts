import { getUsersConfig, writeUserConfig } from "shared/utils/main.ts";
import {
  Command,
  ListActions,
  UserMutable,
  UsersConfig,
} from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";

const on = (config: UsersConfig, _: string[], user: UserMutable) => {
  config.whitelist.active = true;
  user.emit(ProxyEvent.SYSTEM_MESSAGE, {
    message: "Whitelist enabled",
  });
  return config;
};
const off = (config: UsersConfig, _: string[], user: UserMutable) => {
  config.whitelist.active = false;
  user.emit(ProxyEvent.SYSTEM_MESSAGE, {
    message: "Whitelist disabled",
  });
  return config;
};
const add = (config: UsersConfig, args: string[], user: UserMutable) => {
  const username = args[0];
  if (config.whitelist.users.includes(username)) return config;

  config.whitelist.users.push(username);
  user.emit(ProxyEvent.SYSTEM_MESSAGE, {
    message: `User ${username} added to whitelist`,
  });
  return config;
};
const remove = (config: UsersConfig, args: string[], user: UserMutable) => {
  const username = args[0];
  config.whitelist.users = config.whitelist.users.filter((u) => u !== username);
  user.emit(ProxyEvent.SYSTEM_MESSAGE, {
    message: `User ${username} removed from whitelist`,
  });
  return config;
};
const list = (config: UsersConfig, _: string[], user: UserMutable) => {
  user.emit(ProxyEvent.SYSTEM_MESSAGE, {
    message:
      config.whitelist.users.join(", ") || "There is no users on the whitelist",
  });
  return config;
};

export const whitelistCommand: Command = {
  command: "whitelist",
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
