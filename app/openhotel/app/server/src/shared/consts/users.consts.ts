import { UsersConfig } from "shared/types/user.types.ts";

export const USERS_CONFIG_DEFAULT: UsersConfig = {
  op: {
    users: [],
  },
  whitelist: {
    active: false,
    users: [],
  },
  blacklist: {
    active: false,
    users: [],
  },
};
