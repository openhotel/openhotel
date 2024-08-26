import { api } from "./api.ts";
import { ConfigTypes, Envs } from "shared/types/main.ts";
import { getConfig as $getConfig } from "shared/utils/main.ts";
import { load as loadUpdater } from "../modules/updater/main.ts";
import { open } from "open";
import { data } from "./data/main.ts";
import { spriteSheets } from "./sprite-sheets.ts";
import { furniture } from "./furniture.ts";

export const System = (() => {
  const $api = api();
  const $data = data();
  const $spriteSheets = spriteSheets();
  const $furniture = furniture();

  let $config: ConfigTypes;
  let $envs: Envs;

  const load = async (envs: Envs) => {
    $envs = envs;

    if (await loadUpdater(envs)) return;

    $config = await $getConfig();

    await $data.load();
    await $spriteSheets.load();
    await $furniture.load();

    $api.load();

    if (!$envs.isDevelopment) await open($config.url, { wait: true });
  };

  const getConfig = (): ConfigTypes => $config;
  const getEnvs = (): Envs => $envs;

  return {
    load,
    getConfig,
    getEnvs,

    api: $api,
    data: $data,
    spriteSheets: $spriteSheets,
    furniture: $furniture,
  };
})();
