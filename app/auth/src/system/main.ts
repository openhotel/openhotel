import { db } from "./db.ts";
import { api } from "./api.ts";
import { ConfigTypes, Envs } from "shared/types/main.ts";
import { getConfig as $getConfig } from "shared/utils/main.ts";
import { load as loadUpdater } from "modules/updater/main.ts";

export const System = (() => {
  const $db = db();
  const $api = api();

  let $config: ConfigTypes;
  let $envs: Envs;

  const load = async (envs: Envs) => {
    if (await loadUpdater(envs)) return;

    $config = await $getConfig();
    $envs = envs;

    await $db.load();
    $api.load();
  };

  const getConfig = (): ConfigTypes => $config;
  const getEnvs = (): Envs => $envs;

  return {
    load,
    getConfig,
    getEnvs,

    db: $db,
    api: $api,
  };
})();
