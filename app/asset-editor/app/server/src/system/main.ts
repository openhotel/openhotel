import { api } from "./api.ts";
import { ConfigTypes, Envs } from "shared/types/main.ts";
import { CONFIG_DEFAULT } from "shared/consts/config.consts.ts";
import { accounts } from "system/accounts.ts";
import { getConfig as $getConfig } from "@shared/modules/old/config.ts";
import { update } from "@shared/modules/old/updater.ts";

export const System = (() => {
  const $api = api();
  const $accounts = accounts();

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
        repository: "openhotel/asset-editor",
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
    accounts: $accounts,
  };
})();
