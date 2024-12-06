import { System } from "modules/system/main.ts";
import { Server, ServerMutable } from "shared/types/server.types.ts";
import { eventList } from "./events/main.ts";
import { Event } from "shared/enums/event.enums.ts";

export const servers = () => {
  const $serverMap: Record<string, ServerMutable> = {};

  const $getServer = (server: Server): ServerMutable | null => {
    if (!server) return null;
    const $server: Server = { ...server };

    const load = () => {
      for (const { event, func } of eventList)
        getSocket().on(event, (data: any) =>
          func({ server: $serverMap[$server.licenseToken], data }),
        );

      emit(Event.WELCOME);
    };

    const getSocket = () => System.serverSocket.getClient($server.clientId);
    const emit = <Data extends unknown>(
      event: Event,
      data: Data = {} as Data,
    ) => getSocket().emit(event, data);

    const getHotelData = () => $server.hotelData;

    const getHotelId = () => $server.hotelId;
    const getIntegrationId = () => $server.integrationId;

    const getToken = () => $server.licenseToken;

    const getObject = () => $server;

    return {
      load,

      getSocket,
      emit,

      getHotelData,

      getHotelId,
      getIntegrationId,

      getToken,

      getObject,
    };
  };

  const add = (server: Server) => {
    $serverMap[server.licenseToken] = $getServer(server)!;
  };

  const remove = (server: Server) => {
    const $server = $serverMap[server.licenseToken];
    if (!$server) return;

    delete $serverMap[server.licenseToken];
  };

  const get = ({
    clientId,
    licenseToken,
  }: Partial<Pick<Server, "licenseToken" | "clientId">>) => {
    if (licenseToken) return $serverMap[licenseToken];
    if (clientId)
      return getList().find(
        (server) => server.getObject().clientId === clientId,
      );
    return null;
  };

  const getList = () => Object.values($serverMap);

  return {
    add,
    get,
    getList,
    remove,
  };
};
