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
      handshake: config?.limits?.handshake || CONFIG_DEFAULT.limits.handshake,
    },
    ports: {
      client: config?.ports?.client || CONFIG_DEFAULT.ports.client,
      server: config?.ports?.server || CONFIG_DEFAULT.ports.server,
      range: config?.ports?.range || CONFIG_DEFAULT.ports.range,
    },
  };
  try {
    await writeYaml<ConfigTypes>("./config.yml", defaults);
  } catch (e) {}

  return defaults;
};
