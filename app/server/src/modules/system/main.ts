import { Envs, ConfigTypes } from "shared/types/main.ts";
import { proxy } from "./proxy/main.ts";
import { game } from "./game/main.ts";
import { debug, initLog, log } from "shared/utils/main.ts";
import { tasks } from "./tasks.ts";
import { CONFIG_DEFAULT } from "shared/consts/config.consts.ts";
import { getConfig, update, getDb } from "@oh/utils";
import { onet } from "./onet/main.ts";
import { auth } from "./auth.ts";

export const System = (() => {
  let $config: ConfigTypes;
  let $envs: Envs;

  const $proxy = proxy();
  const $tasks = tasks();
  const $game = game();
  const $db = getDb({ pathname: `./server-database` });
  const $onet = onet();
  const $auth = auth();

  const load = async (envs: Envs) => {
    console.clear();

    $envs = envs;
    $config = await getConfig<ConfigTypes>({
      defaults: CONFIG_DEFAULT,
    });

    const isDevelopment = $envs.version === "development";

    // Check for an update if true, close the server
    if (
      !isDevelopment &&
      (await update({
        targetVersion: $config.version,
        version: envs.version,
        repository: "openhotel/openhotel",
        log,
        debug,
      }))
    )
      return;

    if (isDevelopment)
      console.log(
        "\n\n    ------------------\n    DEVELOPMENT SERVER\n    ------------------\n\n",
      );
    initLog();

    // -> Load proxy

    log("server");

    await $auth.load();
    $proxy.load();
    await $db.load();
    await $game.load();
    $tasks.load();
    await $onet.load();
  };

  const $getConfig = () => $config;
  const getEnvs = () => $envs;

  const isDevelopment = () => $config.version === "development";

  return {
    load,

    getConfig: $getConfig,
    getEnvs,
    isDevelopment,

    game: $game,
    proxy: $proxy,
    tasks: $tasks,
    db: $db,
    onet: $onet,
    auth: $auth,
  };
})();
