import { api } from "./api.ts";
import { ConfigTypes, Envs } from "shared/types/main.ts";
import { getConfig as $getConfig, getDb, update, DbMutable } from "@oh/utils";
import { CONFIG_DEFAULT } from "shared/consts/config.consts.ts";
import { Migrations } from "modules/migrations/main.ts";
import { backups } from "modules/system/backups.ts";

export const System = (() => {
  let $config: ConfigTypes;
  let $envs: Envs;

  let $isTestMode = false;

  const $api = api();
  const $backups = backups();
  let $db: DbMutable;

  const load = async (envs: Envs, testMode: boolean = false) => {
    $config = await $getConfig<ConfigTypes>({
      defaults: {
        ...CONFIG_DEFAULT,
        version: testMode ? "development" : CONFIG_DEFAULT.version,
      },
    });
    $envs = envs;

    $isTestMode = testMode;

    const isProduction = !testMode && $config.version !== "development";

    if (
      isProduction &&
      (await update({
        targetVersion: "latest",
        version: envs.version,
        repository: "openhotel/web",
        log: console.log,
        debug: console.debug,
      }))
    )
      return;

    $db = getDb({
      pathname: `./${testMode ? "deleteme-database" : $config.database.filename}`,
      backups: {
        pathname: $config.backups.pathname,
        max: $config.backups.max ?? 10,
        password: $config.backups.password || null,
        s3: $config.backups.s3.enabled ? $config.backups.s3 : null,
      },
    });

    await $db.load();
    if (isProduction) await $db.backup("_start");

    await Migrations.load($db);

    await $db.backup();
    // await $db.visualize();

    if (isProduction) await $backups.load();

    $api.load(testMode);
  };

  const getConfig = (): ConfigTypes => $config;
  const getEnvs = (): Envs => $envs;

  const stop = async () => {
    await $db.backup("_stop");
    $backups.stop();
    Deno.exit();
  };

  return {
    stop,

    load,
    getConfig,
    getEnvs,

    get db() {
      return $db;
    },
    get testMode() {
      return $isTestMode;
    },
    api: $api,
    backups: $backups,
  };
})();
