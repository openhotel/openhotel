import { System } from "modules/system/main.ts";
import { getClientSocket, getWebSocketUrl } from "@da/socket";
import { OnetEvent } from "shared/enums/event.enum.ts";
import { eventList } from "modules/system/onet/events/main.ts";
import { getRandomString } from "@oh/utils";

export const onet = () => {
  let $api;
  let $version;

  let $isConnected: boolean = false;
  let $socket;

  const load = async () => {
    const { auth, onet } = System.getConfig();

    if (!onet.enabled) return;

    const isDevelopment = System.isDevelopment();

    try {
      if (isDevelopment) {
        $api = "http://localhost:9400/api/v1";
      } else {
        const { data } = await fetch(`${auth.api}/onet`).then((data) =>
          data.json(),
        );
        $api = data.api;
      }

      const onetResponse = await fetch(`${$api}/version`).then((data) =>
        data.json(),
      );
      $version = onetResponse.version;

      //CONNECT TO ONET
      const { serverId, token } = System.auth.getAuth();

      const protocols = isDevelopment
        ? [
            `development_${getRandomString(4).toUpperCase()}`,
            getRandomString(16),
          ]
        : [serverId, token];

      if (isDevelopment)
        console.log(`development onet hostname: ${protocols[0]}`);

      $socket = getClientSocket({
        url: getWebSocketUrl($api),
        protocols,
        reconnect: true,
        reconnectIntents: 1000,
        reconnectInterval:
          System.getEnvs().version === "development" ? 1000 : 30_000,
        silent: true,
      });
      for (const { event, func } of eventList) $socket.on(event, func);

      await $socket.connect();
    } catch (e) {
      console.log(e);
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
