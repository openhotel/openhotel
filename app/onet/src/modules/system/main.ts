import { ConfigTypes, Envs } from "shared/types/main.ts";
import { CONFIG_DEFAULTS } from "shared/consts/config.consts.ts";
import { Migrations } from "modules/migrations/main.ts";
import { api } from "./api.ts";
import { serverSocket } from "./server-socket.ts";
import { auth } from "./auth.ts";
import { hotels } from "./hotels/main.ts";
import { teleports } from "./teleports/main.ts";
import { collections } from "./collections/main.ts";
import { DbMutable } from "@shared/types/db.types.ts";
import { getDb } from "@shared/modules/old/db/main.ts";
import { getConfig as $getConfig } from "@shared/modules/old/config.ts";
import { updaterModule } from "@shared/modules/updater.module.ts";

export const System = (() => {
  let $config: ConfigTypes;
  let $envs: Envs;

  const $db: DbMutable = getDb({ pathname: `./database` });
  const $api = api();
  const $serverSocket = serverSocket();

  const $auth = auth();
  const $hotels = hotels();
  const $teleports = teleports();
  const $collections = collections();
  const updater = updaterModule();

  const load = async (envs: Envs) => {
    $envs = envs;
    $config = await $getConfig<ConfigTypes>({
      defaults: CONFIG_DEFAULTS,
    });

    const isDevelopment = $envs.version === "development";

    updater.load({
      project: "onet",
      log: console.log,
      enabled: isDevelopment,
    });

    await updater.update({
      version: envs.version,
      target: $config.version,
      preReleases: true,
      stopOnUpdate: true,
    });

    if (System.isDevelopment())
      console.log(
        "\n\n    ------------------\n    DEVELOPMENT SERVER\n    ------------------\n\n",
      );

    await $auth.load();
    await $db.load();
    await Migrations.load($db);
    await $collections.load();
    $api.load();
    $serverSocket.load($config.port, $api.onRequest);
  };

  const getConfig = () => $config;
  const getEnvs = () => $envs;

  const isDevelopment = () => $config.version === "development";

  return {
    load,
    getConfig,
    getEnvs,
    isDevelopment,

    db: $db,
    api: $api,
    auth: $auth,
    serverSocket: $serverSocket,
    hotels: $hotels,
    teleports: $teleports,
    collections: $collections,
    updater,
  };
})();
