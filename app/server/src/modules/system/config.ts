import { ConfigTypes, Envs } from "shared/types/main.ts";
import { CONFIG_DEFAULT } from "shared/consts/config.consts.ts";
import { getConfig } from "@oh/utils";

export const config = () => {
  let $config: ConfigTypes;

  const load = async (envs: Envs) => {
    const isDevelopment = envs.version === "development";

    $config = await getConfig<ConfigTypes>({
      defaults: {
        ...CONFIG_DEFAULT,
        version: isDevelopment ? "development" : CONFIG_DEFAULT.version,
        auth: {
          ...CONFIG_DEFAULT.auth,
          enabled: isDevelopment ? false : CONFIG_DEFAULT.auth.enabled,
        },
        onet: {
          ...CONFIG_DEFAULT.onet,
          enabled: isDevelopment ? false : CONFIG_DEFAULT.onet.enabled,
        },
      },
    });
  };

  const get = (): ConfigTypes => $config;

  const isDevelopment = () => $config.version === "development";
  const getVersion = () => $config.version;

  return {
    load,
    get,

    isDevelopment,
    getVersion,
  };
};
