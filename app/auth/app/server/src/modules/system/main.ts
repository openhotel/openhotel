import { api } from "./api.ts";
import { ConfigTypes, Envs } from "shared/types/main.ts";
import { getConfig as $getConfig, getDb, update, DbMutable } from "@oh/utils";
import { captcha } from "./captcha.ts";
import { email } from "./email.ts";
import { otp } from "./otp.ts";
import { CONFIG_DEFAULT } from "shared/consts/config.consts.ts";
import { tokens } from "./tokens.ts";
import { accounts } from "./accounts.ts";
import { admins } from "./admins.ts";
import { connections } from "./connections.ts";
import { Migrations } from "modules/migrations/main.ts";
import { hotels } from "./hotels.ts";

export const System = (() => {
  let $config: ConfigTypes;
  let $envs: Envs;

  const $api = api();
  const $captcha = captcha();
  const $email = email();
  const $otp = otp();
  const $tokens = tokens();
  const $accounts = accounts();
  const $admins = admins();
  const $connections = connections();
  const $hotels = hotels();
  let $db: DbMutable;

  const load = async (envs: Envs) => {
    $config = await $getConfig<ConfigTypes>({ defaults: CONFIG_DEFAULT });
    $envs = envs;

    if (
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

    $db = getDb({ pathname: `./${$config.database.filename}` });

    await $db.load();
    await Migrations.load($db);

    {
      try {
        const entries = [];
        for (const entry of await $db.list({ prefix: [] })) {
          // Fetch all entries
          entries.push({
            key: JSON.stringify(entry.key),
            value: JSON.stringify(entry.value)?.substring(0, 8),
          });
        }

        console.table(entries); // Format as a table
        console.log(`Total entries: ${entries.length}`);
      } finally {
      }
    }

    await $email.load();
    $api.load();
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
    captcha: $captcha,
    email: $email,
    otp: $otp,
    tokens: $tokens,
    accounts: $accounts,
    admins: $admins,
    connections: $connections,
    hotels: $hotels,
  };
})();
