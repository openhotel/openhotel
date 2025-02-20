import { ConfigTypes, Envs } from "shared/types/main.ts";
import { getConfig as $getConfig, DbMutable, getDb } from "@oh/utils";
import { CONFIG_DEFAULT } from "shared/consts/config.consts.ts";
import { Migrations } from "modules/migrations/main.ts";
import { api } from "./api.ts";
import { files } from "./files.ts";

export const System = (() => {
  const $api = api();

  let $config: ConfigTypes;
  let $envs: Envs;

  const $files = files();
  let $db: DbMutable;

  const load = async (envs: Envs) => {
    $envs = envs;
    $config = await $getConfig<ConfigTypes>({ defaults: CONFIG_DEFAULT });

    const isProduction = $config.version !== "development";

    $db = getDb({
      pathname: `./${$config.database.filename}`,
      backupsPathname: `./${$config.database.backupName}`,
    });

    await $db.load();
    if (isProduction) await $db.backup("_start");

    await Migrations.load($db);

    await $db.visualize();

    $api.load();
    $files.load();
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

    files: $files,
    api: $api,
  };
})();
