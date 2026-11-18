import { api } from "./api.ts";
import { ConfigTypes, Envs } from "shared/types/main.ts";
import { CONFIG_DEFAULT } from "shared/consts/config.consts.ts";
import { Migrations } from "./migrations/main.ts";
import { backups } from "./backups.ts";
import { accounts } from "./accounts.ts";
import { auth } from "system/auth.ts";
import { DbMutable } from "@shared/types/db.types.ts";
import { getConfig } from "@shared/modules/old/config.ts";
import { getDb } from "@shared/modules/old/db/main.ts";
import { updaterModule } from "@shared/modules/updater.module.ts";

export const System = (() => {
  let $config: ConfigTypes;
  let $envs: Envs;

  let $isTestMode = false;

  const $api = api();
  const $backups = backups();
  const $accounts = accounts();
  const $auth = auth();
  const updater = updaterModule();

  let $db: DbMutable;

  const load = async (envs: Envs, testMode: boolean = false) => {
    $config = await getConfig<ConfigTypes>({
      defaults: {
        ...CONFIG_DEFAULT,
        version: testMode ? "development" : CONFIG_DEFAULT.version,
      },
    });
    $envs = envs;

    $isTestMode = testMode;

    await $auth.load($config);

    const isProduction = !testMode && $config.version !== "development";

    updater.load({
      project: "web",
      log: console.log,
      enabled: isProduction,
    });

    await updater.update({
      version: envs.version,
      target: "latest",
      preReleases: true,
      stopOnUpdate: true,
    });

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

  const $getConfig = (): ConfigTypes => $config;
  const getEnvs = (): Envs => $envs;

  const stop = async () => {
    await $db.backup("_stop");
    $backups.stop();
    Deno.exit();
  };

  return {
    stop,

    load,
    getConfig: $getConfig,
    getEnvs,

    get db() {
      return $db;
    },
    get testMode() {
      return $isTestMode;
    },
    api: $api,
    backups: $backups,
    accounts: $accounts,
    auth: $auth,
    updater,
  };
})();
