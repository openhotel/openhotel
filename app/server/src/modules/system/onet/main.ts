import { System } from "modules/system/main.ts";
import { getClientSocket, getWebSocketUrl } from "@da/socket";
import { OnetEvent } from "shared/enums/event.enum.ts";
import { eventList } from "modules/system/onet/events/main.ts";

export const onet = () => {
  let $isConnected: boolean = false;
  let $socket;

  const load = async () => {
    const { auth, onet } = System.getConfig();

    if (!onet.enabled) return;

    try {
      await fetch(`${onet.api}/version`).then((data) => data.json());

      $socket = getClientSocket({
        url: getWebSocketUrl(onet.api),
        protocols: [auth.licenseToken],
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
