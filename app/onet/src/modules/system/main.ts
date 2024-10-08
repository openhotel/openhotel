import { ConfigTypes, Envs } from "shared/types/main.ts";
import { getConfig as $getConfig } from "@oh/utils";
import { CONFIG_DEFAULTS } from "shared/consts/config.consts.ts";
import { api } from "./api.ts";
import { server } from "./server.ts";

export const System = (() => {
  let $config: ConfigTypes;
  let $envs: Envs;

  const $api = api();
  const $server = server();

  const load = async (envs: Envs) => {
    $envs = envs;
    $config = await $getConfig<ConfigTypes>({
      defaults: CONFIG_DEFAULTS,
    });

    $api.load();
    $server.load($config.port, $api.onRequest);
  };

  const getConfig = () => $config;
  const getEnvs = () => $envs;

  return {
    load,
    getConfig,
    getEnvs,

    api: $api,
  };
})();
