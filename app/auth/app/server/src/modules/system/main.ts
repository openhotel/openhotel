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
import { DELETE_BACKUP_PATH } from "shared/consts/backups.consts.ts";
import { backups } from "modules/system/backups.ts";

export const System = (() => {
  let $config: ConfigTypes;
  let $envs: Envs;

  let $isTestMode = false;

  const $api = api();
  const $captcha = captcha();
  const $email = email();
  const $tokens = tokens();
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
      backupsPathname: DELETE_BACKUP_PATH,
    });

    await $db.load();
    if (isProduction) await $db.backup("_start");

    await Migrations.load($db);

    await $db.visualize();

    await $email.load();
    if (isProduction) await $backups.load();

    $api.load(testMode);
  };

  const getConfig = (): ConfigTypes => $config;
  const getEnvs = (): Envs => $envs;

  const getDbSecretKey = (): string => Deno.env.get("DB_SECRET_KEY") ?? "";

  return {
    load,
    getConfig,
    getEnvs,
    getDbSecretKey,

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
    accounts: $accounts,
    hotels: $hotels,
    backups: $backups,
  };
})();
