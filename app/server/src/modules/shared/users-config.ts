import { UsersConfig } from "shared/types/main.ts";
import { USERS_CONFIG_DEFAULT } from "shared/consts/users.consts.ts";
import { getConfig } from "@oh/utils";
import { exists } from "deno/fs/mod.ts";

export const usersConfig = () => {
  const load = async () => {
    // Check config file
    const config = await exists(Deno.cwd() + "/users.yml");
    if (!config) {
      await setConfig({
        op: {
          users: [],
        },
        blacklist: {
          active: false,
          users: [],
        },
        whitelist: {
          active: false,
          users: [],
        },
      });
    }
  };

  const $getConfig = (): Promise<UsersConfig> => {
    return getConfig<UsersConfig>({
      defaults: USERS_CONFIG_DEFAULT,
      fileName: "users.yml",
    });
  };

  const setConfig = async (config: UsersConfig): Promise<void> => {
    await getConfig<UsersConfig>({
      values: config,
      defaults: USERS_CONFIG_DEFAULT,
      fileName: "users.yml",
    });
  };

  return {
    load,

    getConfig: $getConfig,
    setConfig,
  };
};
