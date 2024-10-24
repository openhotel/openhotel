import { api } from "./api.ts";
import { ConfigTypes, Envs } from "shared/types/main.ts";
import { getConfig as $getConfig, getDb, update } from "@oh/utils";
import { CONFIG_DEFAULT } from "shared/consts/config.consts.ts";

export const System = (() => {
  let $config: ConfigTypes;
  let $envs: Envs;

  const $api = api();
  let $db;

  const load = async (envs: Envs) => {
    $config = await $getConfig<ConfigTypes>({ defaults: CONFIG_DEFAULT });
    $envs = envs;

    if (
      !$config.development &&
      (await update({
        targetVersion: "latest",
        version: envs.version,
        repository: "openhotel/web",
        log: console.log,
        debug: console.debug,
      }))
    )
      return;

    $db = getDb({ pathname: `./${$config.database.filename}` });

    await $db.load();
    $api.load();
  };

  const getConfig = (): ConfigTypes => $config;
  const getEnvs = (): Envs => $envs;

  return {
    load,
    getConfig,
    getEnvs,

    get db() {
      return $db;
    },
    api: $api,
  };
})();
