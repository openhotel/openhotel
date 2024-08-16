import { readYaml, writeYaml } from "./yaml.utils.ts";
import { ConfigTypes } from "shared/types/config.types.ts";
import { CONFIG_DEFAULT } from "shared/consts/config.consts.ts";

export const getConfig = async (): Promise<ConfigTypes> => {
  let config;
  try {
    config = await readYaml<ConfigTypes>("./config.yml");
  } catch (e) {}

  const defaults: ConfigTypes = {
    version: config?.version || CONFIG_DEFAULT.version,
    name: config?.name || CONFIG_DEFAULT.name,
    description: config?.description || CONFIG_DEFAULT.description,
    limits: {
      players: config?.limits?.players || CONFIG_DEFAULT.limits.players,
    },
    client: {
      port: config?.client?.port || CONFIG_DEFAULT.client.port,
    },
    proxy: {
      port: config?.proxy?.port || CONFIG_DEFAULT.proxy.port,
      url: config?.proxy?.url || CONFIG_DEFAULT.proxy.url,
    },
    auth: {
      redirectUrl: config?.auth?.redirectUrl || CONFIG_DEFAULT.auth.redirectUrl,
      url: config?.auth?.url || CONFIG_DEFAULT.auth.url,
      api: config?.auth?.api || CONFIG_DEFAULT.auth.api,
    },
  };
  try {
    await writeYaml<ConfigTypes>("./config.yml", defaults, { async: true });
  } catch (e) {}

  return defaults;
};
