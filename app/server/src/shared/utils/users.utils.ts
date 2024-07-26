import { UsersConfig } from "shared/types/user.types.ts";
import { readYaml, writeYaml } from "shared/utils/yaml.utils.ts";

export const getUsersConfig = async (): Promise<UsersConfig> => {
  let usersConfig;
  try {
    usersConfig = await readYaml<UsersConfig>("./users.yml");
  } catch (e) {}

  const defaults: UsersConfig = {
    op: {
      users: usersConfig?.op?.users || [],
    },
    whitelist: {
      active: usersConfig?.whitelist?.active || false,
      users: usersConfig?.whitelist?.users || [],
    },
    blacklist: {
      active: usersConfig?.blacklist?.active || false,
      users: usersConfig?.blacklist?.users || [],
    },
  };

  await writeUserConfig(defaults);

  return defaults;
};

export const writeUserConfig = async (config: UsersConfig) => {
  try {
    await writeYaml<UsersConfig>("./users.yml", config, { async: true });
  } catch (e) {}
};
