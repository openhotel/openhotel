import { Envs, ConfigTypes } from "shared/types/main.ts";
import { WorkerParent } from "worker_ionic";
import { proxy } from "./proxy/main.ts";
import { users } from "./users.ts";
import { log } from "shared/utils/main.ts";
import { rooms } from "./rooms.ts";

export const Server = (() => {
  let $config: ConfigTypes;
  let $envs: Envs;

  let $proxy = proxy();

  let $users = users();
  let $rooms = rooms();

  const load = (config: ConfigTypes, envs: Envs, proxyWorker: WorkerParent) => {
    log("server");

    $config = config;
    $envs = envs;

    $proxy.load(proxyWorker);
  };

  const getConfig = () => $config;
  const getEnvs = () => $envs;

  return {
    load,

    getConfig,
    getEnvs,

    users: $users,
    rooms: $rooms,

    proxy: $proxy,
  };
})();
