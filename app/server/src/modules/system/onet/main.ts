import { System } from "modules/system/main.ts";
import { getClientSocket, getWebSocketUrl } from "@da/socket";
import { OnetEvent } from "shared/enums/event.enum.ts";
import { eventList } from "modules/system/onet/events/main.ts";
import { log } from "shared/utils/log.utils.ts";

export const onet = () => {
  let $api;
  let $version;

  let $isConnected: boolean = false;
  let $socket;

  const load = async () => {
    const { auth, onet } = System.getConfig();

    if (!onet.enabled) return;

    try {
      const { data } = await fetch(`${auth.api}/onet`).then((data) =>
        data.json(),
      );
      $api = data.api;

      const onetResponse = await fetch(`${$api}/version`).then((data) =>
        data.json(),
      );
      $version = onetResponse.version;

      //CONNECT TO ONET
      const { serverId, token } = System.auth.getAuth();
      log(serverId, token);
      $socket = getClientSocket({
        url: getWebSocketUrl($api),
        protocols: [serverId, token],
        reconnect: true,
        reconnectIntents: 1000,
        reconnectInterval:
          System.getEnvs().version === "development" ? 1000 : 30_000,
        silent: true,
      });
      for (const { event, func } of eventList) $socket.on(event, func);

      await $socket.connect();
    } catch (e) {
      console.error(`/!\\ Onet server is not reachable!`);
    }
  };

  const emit = <Data extends unknown>(
    event: OnetEvent,
    data: Data = {} as Data,
  ) => $socket?.emit(event, data);

  const isConnected = () => $isConnected;
  const $setIsConnected = (connected: boolean) => ($isConnected = connected);

  return {
    load,

    emit,
    isConnected,

    $setIsConnected,
  };
};
