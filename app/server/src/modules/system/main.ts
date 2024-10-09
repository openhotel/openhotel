import { Envs, ConfigTypes } from "shared/types/main.ts";
import { proxy } from "./proxy/main.ts";
import { game } from "./game/main.ts";
import { debug, initLog, log } from "shared/utils/main.ts";
import { tasks } from "./tasks.ts";
import { CONFIG_DEFAULT } from "shared/consts/config.consts.ts";
import { getConfig, update, getDb } from "@oh/utils";

export const System = (() => {
  let $config: ConfigTypes;
  let $envs: Envs;

  const $proxy = proxy();
  const $tasks = tasks();
  const $game = game();
  const $db = getDb({ pathname: `./server-database` });

  const load = async (envs: Envs) => {
    console.clear();

    $envs = envs;
    $config = await getConfig<ConfigTypes>({
      defaults: CONFIG_DEFAULT,
    });

    // Check for an update if true, close the server
    if (
      !$config.development &&
      (await update({
        targetVersion: $config.version,
        version: envs.version,
        repository: "openhotel/openhotel",
        log,
        debug,
      }))
    )
      return;

    if ($config.development)
      console.log(
        "\n\n    ------------------\n    DEVELOPMENT SERVER\n    ------------------\n\n",
      );
    initLog($config);

    // -> Load proxy

    log("server");

    $proxy.load($config, envs);
    await $db.load();
    await $game.load();
    $tasks.load();
  };

  const $getConfig = () => $config;
  const getEnvs = () => $envs;

  return {
    load,

    getConfig: $getConfig,
    getEnvs,

    game: $game,
    proxy: $proxy,
    tasks: $tasks,
    db: $db,
  };
})();
