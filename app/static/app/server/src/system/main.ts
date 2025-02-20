import { api } from "./api.ts";
import { ConfigTypes, Envs } from "shared/types/main.ts";
import { getConfig as $getConfig, update } from "@oh/utils";
import { CONFIG_DEFAULT } from "shared/consts/config.consts.ts";

export const System = (() => {
  const $api = api();

  let $config: ConfigTypes;
  let $envs: Envs;

  const load = async (envs: Envs) => {
    $envs = envs;
    $config = await $getConfig<ConfigTypes>({ defaults: CONFIG_DEFAULT });

    if (
      $config.version !== "development" &&
      (await update({
        targetVersion: "latest",
        version: envs.version,
        repository: "openhotel/static",
        log: console.log,
        debug: console.debug,
      }))
    )
      return;

    $api.load();
  };

  const getConfig = (): ConfigTypes => $config;
  const getEnvs = (): Envs => $envs;

  return {
    load,
    getConfig,
    getEnvs,

    api: $api,
  };
})();
