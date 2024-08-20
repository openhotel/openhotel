import { api } from "./api.ts";
import { ConfigTypes, Envs } from "shared/types/main.ts";
import { getConfig as $getConfig } from "shared/utils/main.ts";
import { load as loadUpdater } from "../modules/updater/main.ts";

export const System = (() => {
  const $api = api();

  let $config: ConfigTypes;

  const load = async (envs: Envs) => {
    if (await loadUpdater(envs)) return;

    $config = await $getConfig();

    $api.load();
  };

  const getConfig = (): ConfigTypes => $config;

  return {
    load,
    getConfig,

    api: $api,
  };
})();
