import { api } from "./api.ts";
import { ConfigTypes, Envs } from "shared/types/main.ts";
import { CONFIG_DEFAULT } from "shared/consts/config.consts.ts";
import { accounts } from "system/accounts.ts";
import { getConfig as $getConfig } from "@shared/modules/old/config.ts";
import { updaterModule } from "@shared/modules/updater.module.ts";

export const System = (() => {
  const $api = api();
  const $accounts = accounts();
  const updater = updaterModule();

  let $config: ConfigTypes;
  let $envs: Envs;

  const load = async (envs: Envs) => {
    $envs = envs;
    $config = await $getConfig<ConfigTypes>({ defaults: CONFIG_DEFAULT });

    updater.load({
      project: "asset-editor",
      log: console.log,
      enabled: $config.version !== "development",
    });

    await updater.update({
      version: envs.version,
      target: "latest",
      preReleases: true,
      stopOnUpdate: true,
    });

    $api.load();
  };

  const getConfig = (): ConfigTypes => $config;
  const getEnvs = (): Envs => $envs;

  return {
    load,
    getConfig,
    getEnvs,

    updater,
    api: $api,
    accounts: $accounts,
  };
})();
