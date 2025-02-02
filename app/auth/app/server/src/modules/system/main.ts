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

export const System = (() => {
  let $config: ConfigTypes;
  let $envs: Envs;

  const $api = api();
  const $captcha = captcha();
  const $email = email();
  const $tokens = tokens();
  const $accounts = accounts();
  const $hotels = hotels();
  let $db: DbMutable;

  const load = async (envs: Envs, testMode: boolean = false) => {
    $config = await $getConfig<ConfigTypes>({ defaults: CONFIG_DEFAULT });
    $envs = envs;

    if (
      !testMode &&
      $config.version !== "development" &&
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
      pathname: `./${$config.database.filename}`,
      backupsPathname: "./database-backups",
    });

    await $db.load();
    if (!testMode) await $db.backup("_start");

    await Migrations.load($db);

    // await $db.visualize();

    if (!testMode)
      Deno.cron("Backup auth", $config.backups.cron, async () => {
        await $db.backup("_cron");
        console.log("Backup ready!");
      });

    await $email.load();
    $api.load();
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
    api: $api,
    captcha: $captcha,
    email: $email,
    tokens: $tokens,
    accounts: $accounts,
    hotels: $hotels,
  };
})();
