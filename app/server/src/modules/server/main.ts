import { Envs, ConfigTypes } from "shared/types/main.ts";
import { WorkerParent } from "worker_ionic";
import { proxy } from "./proxy/main.ts";
import { game } from "./game/main.ts";
import { log } from "shared/utils/main.ts";
import { tasks } from "./tasks.ts";

export const Server = (() => {
  let $config: ConfigTypes;
  let $envs: Envs;

  let $proxy = proxy();
  let $tasks = tasks();

  const load = ({
    config,
    envs,
    proxyWorker,
  }: {
    config: ConfigTypes;
    envs: Envs;
    proxyWorker: WorkerParent;
  }) => {
    log("server");

    $config = config;
    $envs = envs;

    $proxy.load(proxyWorker);
    $tasks.load();
  };

  const getConfig = () => $config;
  const getEnvs = () => $envs;

  return {
    load,

    getConfig,
    getEnvs,

    game: game(),

    proxy: $proxy,

    tasks: $tasks,
  };
})();
