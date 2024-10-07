import { Envs, ConfigTypes } from "shared/types/main.ts";
import { proxy } from "./proxy/main.ts";
import { game } from "./game/main.ts";
import { debug, initLog, log } from "shared/utils/main.ts";
import { tasks } from "./tasks.ts";
import { CONFIG_DEFAULT } from "shared/consts/config.consts.ts";
import { getConfig, update, getDb } from "@oh/utils";
import { load as loadProxy } from "modules/proxy/main.ts";

export const System = (() => {
  let $config: ConfigTypes;
  let $envs: Envs;

  const $proxy = proxy();
  const $tasks = tasks();
  const $game = game();
  const $db = getDb({ pathname: `./server-database` });

  const load = async (envs: Envs) => {
    console.clear();

    if (envs.isDevelopment)
      console.log(
        "\n\n    ------------------\n    DEVELOPMENT SERVER\n    ------------------\n\n",
      );
    initLog(envs);

    $config = await getConfig<ConfigTypes>({
      defaults: CONFIG_DEFAULT,
    });

    // Check for an update if true, close the server
    if (
      !envs.isDevelopment &&
      (await update({
        targetVersion: $config.version,
        version: envs.version,
        repository: "openhotel/openhotel",
        log,
        debug,
      }))
    )
      return;

    // -> Load proxy
    const { proxyWorker } = await loadProxy({ config: $config, envs });

    log("server");

    $envs = envs;

    await $db.load();
    await $game.load();
    $proxy.load(proxyWorker);
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
