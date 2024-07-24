import { readYaml, writeYaml } from "./yaml.utils.ts";
import { ConfigTypes } from "shared/types/config.types.ts";
import { CONFIG_DEFAULT } from "shared/consts/config.consts.ts";

export const getConfig = async (): Promise<ConfigTypes> => {
  let config;
  try {
    config = await readYaml<ConfigTypes>("./config.yml");
  } catch (e) {}

  const defaults: ConfigTypes = {
    version: 1,
    name: config?.name || CONFIG_DEFAULT.name,
    description: config?.description || CONFIG_DEFAULT.description,
    limits: {
      players: config?.limits?.players || CONFIG_DEFAULT.limits.players,
      handshakes:
        config?.limits?.handshakes || CONFIG_DEFAULT.limits.handshakes,
    },
    client: {
      port: config?.client?.port || CONFIG_DEFAULT.client.port,
    },
    firewall: {
      port: config?.firewall?.port || CONFIG_DEFAULT.firewall.port,
      url: config?.firewall?.url || CONFIG_DEFAULT.firewall.url,
    },
    proxy: {
      port: config?.proxy?.port || CONFIG_DEFAULT.proxy.port,
      url: config?.proxy?.url || CONFIG_DEFAULT.proxy.url,
    },
    auth: {
      url: config?.auth?.url || CONFIG_DEFAULT.auth.url,
    },
    captcha: {
      enabled: config?.captcha?.enabled ?? CONFIG_DEFAULT.captcha.enabled,
      url: config?.captcha?.url || CONFIG_DEFAULT.captcha.url,
      id: config?.captcha?.id || CONFIG_DEFAULT.captcha.id,
    },
  };
  try {
    await writeYaml<ConfigTypes>("./config.yml", defaults, { async: true });
  } catch (e) {}

  return defaults;
};
