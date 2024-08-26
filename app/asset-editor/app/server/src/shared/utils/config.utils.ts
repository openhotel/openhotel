import { ConfigTypes } from "shared/types/config.types.ts";
import { CONFIG_DEFAULT } from "shared/consts/config.consts.ts";
import { System } from "system/main.ts";

export const getConfig = async (): Promise<ConfigTypes> => {
  let config: ConfigTypes = {} as ConfigTypes;
  try {
    config = await System.data.yaml.read<ConfigTypes>("./config.yml", true);
  } catch (e) {}

  const defaults: ConfigTypes = {
    port: config?.port || CONFIG_DEFAULT.port,
    url: config?.url || CONFIG_DEFAULT.url,
  };
  try {
    await System.data.yaml.write("./config.yml", defaults, true);
  } catch (e) {}

  return defaults;
};
