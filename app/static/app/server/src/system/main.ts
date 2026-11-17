import { ConfigTypes, Envs } from "shared/types/main.ts";
import { CONFIG_DEFAULT } from "shared/consts/config.consts.ts";
import { Migrations } from "modules/migrations/main.ts";
import { api } from "./api.ts";
import { files } from "./files.ts";
import { accounts } from "./accounts.ts";
import { DbMutable } from "@shared/types/db.types.ts";
import { getConfig as $getConfig } from "@shared/modules/old/config.ts";
import { update } from "@shared/modules/old/updater.ts";
import { getDb } from "@shared/modules/old/db/main.ts";

export const System = (() => {
  const $api = api();

  let $config: ConfigTypes;
  let $envs: Envs;

  const $files = files();
  const $accounts = accounts();
  let $db: DbMutable;

  const load = async (envs: Envs) => {
    $envs = envs;
    $config = await $getConfig<ConfigTypes>({ defaults: CONFIG_DEFAULT });

    const isProduction = $config.version !== "development";
    if (
      isProduction &&
      (await update({
        targetVersion: "latest",
        version: envs.version,
        repository: "openhotel/static",
        log: console.log,
        debug: console.debug,
      }))
    )
      return;

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

    api: $api,
    files: $files,
    accounts: $accounts,
  };
})();
