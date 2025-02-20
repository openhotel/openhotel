import { api } from "./api.ts";
import { ConfigTypes, Envs } from "shared/types/main.ts";
import { getConfig as $getConfig, getDb, update, DbMutable } from "@oh/utils";
import { captcha } from "./captcha.ts";
import { email } from "./email.ts";
import { CONFIG_DEFAULT } from "shared/consts/config.consts.ts";
import { tokens } from "./tokens.ts";
import { accounts } from "./accounts/main.ts";
import { Migrations } from "modules/migrations/main.ts";
import { hotels } from "./hotels/main.ts";
import { backups } from "modules/system/backups.ts";
import { apps } from "modules/system/apps.ts";

export const System = (() => {
  let $config: ConfigTypes;
  let $envs: Envs;

  let $isTestMode = false;

  const $api = api();
  const $captcha = captcha();
  const $email = email();
  const $tokens = tokens();
  const $apps = apps();
  const $accounts = accounts();
  const $hotels = hotels();
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
        repository: "openhotel/auth",
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

    await $email.load();
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
    captcha: $captcha,
    email: $email,
    tokens: $tokens,
    apps: $apps,
    accounts: $accounts,
    hotels: $hotels,
    backups: $backups,
  };
})();
