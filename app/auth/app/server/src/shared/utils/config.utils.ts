import { readYaml, writeYaml } from "./yaml.utils.ts";
import { ConfigTypes } from "shared/types/config.types.ts";
import { CONFIG_DEFAULT } from "shared/consts/config.consts.ts";

export const getConfig = async (): Promise<ConfigTypes> => {
  let config: ConfigTypes = {} as ConfigTypes;
  try {
    config = await readYaml<ConfigTypes>("./config.yml");
  } catch (e) {}

  const defaults: ConfigTypes = {
    port: config?.port || CONFIG_DEFAULT.port,
    url: config?.url || CONFIG_DEFAULT.url,
    sessions: {
      checkInterval:
        config?.sessions?.checkInterval ||
        CONFIG_DEFAULT.sessions.checkInterval,
    },
    database: {
      filename: config?.database?.filename || CONFIG_DEFAULT.database.filename,
    },
    captcha: {
      enabled: config?.captcha?.enabled ?? CONFIG_DEFAULT.captcha.enabled,
      url: config?.captcha?.url ?? CONFIG_DEFAULT.captcha.url,
      id: config?.captcha?.id ?? CONFIG_DEFAULT.captcha.id,
      token: config?.captcha?.token ?? CONFIG_DEFAULT.captcha.token,
    },
    email: {
      enabled: config?.email?.enabled ?? CONFIG_DEFAULT.email.enabled,
      hostname: config?.email?.hostname ?? CONFIG_DEFAULT.email.hostname,
      username: config?.email?.username ?? CONFIG_DEFAULT.email.username,
      password: config?.email?.password ?? CONFIG_DEFAULT.email.password,
      port: config?.email?.port ?? CONFIG_DEFAULT.email.port,
    },
  };
  try {
    await writeYaml<ConfigTypes>("./config.yml", defaults, { async: true });
  } catch (e) {}

  return defaults;
};
