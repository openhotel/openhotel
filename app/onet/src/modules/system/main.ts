import { ConfigTypes, Envs } from "shared/types/main.ts";
import { getConfig as $getConfig } from "@oh/utils";
import { CONFIG_DEFAULTS } from "shared/consts/config.consts.ts";
import { api } from "./api.ts";
import { serverSocket } from "./server-socket.ts";
import { auth } from "./auth.ts";
import { servers } from "./servers/main.ts";

export const System = (() => {
  let $config: ConfigTypes;
  let $envs: Envs;

  const $api = api();
  const $serverSocket = serverSocket();
  const $auth = auth();
  const $servers = servers();

  const load = async (envs: Envs) => {
    $envs = envs;
    $config = await $getConfig<ConfigTypes>({
      defaults: CONFIG_DEFAULTS,
    });

    await $auth.load();
    $api.load();
    $serverSocket.load($config.port, $api.onRequest);
  };

  const getConfig = () => $config;
  const getEnvs = () => $envs;

  return {
    load,
    getConfig,
    getEnvs,

    api: $api,
    auth: $auth,
    serverSocket: $serverSocket,
    servers: $servers,
  };
})();
