import { __ } from "shared/utils/main.ts";
import {
  Command,
  ListActions,
  UserMutable,
  UsersConfig,
} from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";
import { System } from "modules/system/main.ts";

const on = (config: UsersConfig, _: string[], user: UserMutable) => {
  config.whitelist.active = true;
  user.emit(ProxyEvent.SYSTEM_MESSAGE, {
    message: __(user.getLanguage(), "Whitelist enabled"),
  });
  return config;
};
const off = (config: UsersConfig, _: string[], user: UserMutable) => {
  config.whitelist.active = false;
  user.emit(ProxyEvent.SYSTEM_MESSAGE, {
    message: __(user.getLanguage(), "Whitelist disabled"),
  });
  return config;
};
const add = (config: UsersConfig, args: string[], user: UserMutable) => {
  const username = args[0];
  if (config.whitelist.users.includes(username)) return config;

  config.whitelist.users.push(username);
  user.emit(ProxyEvent.SYSTEM_MESSAGE, {
    message: __(user.getLanguage(), "User {{username}} added to whitelist", {
      username,
    }),
  });
  return config;
};
const remove = (config: UsersConfig, args: string[], user: UserMutable) => {
  const username = args[0];
  config.whitelist.users = config.whitelist.users.filter((u) => u !== username);
  user.emit(ProxyEvent.SYSTEM_MESSAGE, {
    message: __(
      user.getLanguage(),
      "User {{username}} removed from whitelist",
      {
        username,
      },
    ),
  });
  return config;
};
const list = (config: UsersConfig, _: string[], user: UserMutable) => {
  user.emit(ProxyEvent.SYSTEM_MESSAGE, {
    message:
      config.whitelist.users.join(", ") ||
      __(user.getLanguage(), "There is no users on the whitelist"),
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

    const config = await System.game.users.getConfig();
    args.shift();
    command(config, args as string[], user);

    await System.game.users.setConfig(config);
  },
};
