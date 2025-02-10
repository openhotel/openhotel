import { System } from "modules/system/main.ts";
import { getClientSocket, getWebSocketUrl } from "@da/socket";
import { OnetEvent } from "shared/enums/event.enum.ts";
import { eventList } from "modules/system/onet/events/main.ts";
import { Request } from "shared/types/request.types.ts";
import { RequestMethod } from "@oh/utils";

export const onet = () => {
  let $isConnected: boolean = false;
  let $socket;
  let $apiToken: string;

  const load = async () => {
    const { auth, onet } = System.config.get();

    if (!auth.enabled || !onet.enabled) return;

    const hotelId = System.auth.getHotelId();
    try {
      await fetch(`${onet.api}/api/v1/version`).then((data) => data.json());
      $socket = getClientSocket({
        url: getWebSocketUrl(onet.api),
        protocols: [hotelId, auth.licenseToken],
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

  const setApiToken = (apiToken: string) => {
    $apiToken = apiToken;
  };

  const $fetch = async ({
    method = RequestMethod.GET,
    pathname,
    body,
  }: Request) => {
    const { onet } = System.config.get();

    const response = await fetch(`${onet.api}/api/v1${pathname}`, {
      method,
      headers: new Headers({
        "Content-Type": "application/json",
        token: $apiToken,
        "hotel-id": System.auth.getHotelId(),
      }),
      body: body ? JSON.stringify(body) : undefined,
    });

    if (response.status !== 200)
      throw {
        status: response.status,
      };

    return await response.json();
  };

  return {
    load,

    emit,
    isConnected,

    $setIsConnected,

    setApiToken,

    fetch: $fetch,
  };
};
