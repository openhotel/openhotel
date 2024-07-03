import { readYaml, writeYaml } from "./yaml.utils.ts";
import { ConfigTypes } from "shared/types/config.types.ts";
import { CONFIG_DEFAULT } from "shared/consts/config.consts.ts";

export const getConfig = async (): Promise<ConfigTypes> => {
  let config;
  try {
    config = await readYaml<ConfigTypes>("./config.yml");
  } catch (e) {}

  const defaults: ConfigTypes = {
    name: config?.name || CONFIG_DEFAULT.name,
    description: config?.description || CONFIG_DEFAULT.description,
    limits: {
      players: config?.limits?.players || CONFIG_DEFAULT.limits.players,
      handshakes: config?.limits?.handshake || CONFIG_DEFAULT.limits.handshakes,
    },
    client: {
      port: config?.client?.port || CONFIG_DEFAULT.client.port,
    },
    firewall: {
      port: config?.firewall?.port || CONFIG_DEFAULT.firewall.port,
      url: config?.firewall?.port || CONFIG_DEFAULT.firewall.port,
    },
    proxy: {
      port: config?.proxy?.port || CONFIG_DEFAULT.proxy.port,
      url: config?.proxy?.port || CONFIG_DEFAULT.proxy.port,
    },
  };
  try {
    await writeYaml<ConfigTypes>("./config.yml", defaults);
  } catch (e) {}

  return defaults;
};
