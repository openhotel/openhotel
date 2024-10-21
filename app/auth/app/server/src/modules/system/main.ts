import { api } from "./api.ts";
import { ConfigTypes, Envs } from "shared/types/main.ts";
import { getConfig as $getConfig, getDb, update } from "@oh/utils";
import { captcha } from "./captcha.ts";
import { email } from "./email.ts";
import { otp } from "./otp.ts";
import { tasks } from "./tasks.ts";
import { sessions } from "./sessions.ts";
import { CONFIG_DEFAULT } from "shared/consts/config.consts.ts";
import { servers } from "./servers.ts";
import { tokens } from "modules/system/tokens.ts";

export const System = (() => {
  let $config: ConfigTypes;
  let $envs: Envs;

  const $api = api();
  const $captcha = captcha();
  const $email = email();
  const $otp = otp();
  const $tasks = tasks();
  const $sessions = sessions();
  const $servers = servers();
  const $tokens = tokens();
  let $db;

  const load = async (envs: Envs) => {
    $config = await $getConfig<ConfigTypes>({ defaults: CONFIG_DEFAULT });
    $envs = envs;

    if (
      !$config.development &&
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

    $tasks.load();
    await $db.load();
    await $email.load();
    $api.load();

    $sessions.load();
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
    tasks: $tasks,
    sessions: $sessions,
    servers: $servers,
    tokens: $tokens,
  };
})();
