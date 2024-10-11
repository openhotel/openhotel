import { System } from "modules/system/main.ts";
import { RequestMethod } from "@oh/utils";
import { Server, ServerMutable } from "shared/types/server.types.ts";
import { eventList } from "./events/main.ts";
import { Event } from "shared/enums/event.enums.ts";

export const servers = () => {
  const $serverMap: Record<string, ServerMutable> = {};

  const getHostname = async (
    serverId: string,
    token: string,
    ip: string,
  ): Promise<string | null> => {
    try {
      const { hostname } = await System.auth.fetch<{ hostname: string }>(
        RequestMethod.POST,
        "/onet/server",
        {
          serverId,
          token,
          ip,
        },
      );
      return hostname;
    } catch (e) {
      return null;
    }
  };

  const $getServer = (server: Server): ServerMutable | null => {
    if (!server) return null;
    const $server: Server = { ...server };

    const getId = () => $server.serverId;
    const getHostname = () => $server.hostname;

    const load = () => {
      for (const { event, func } of eventList)
        getSocket().on(event, (data: any) =>
          func({ server: $serverMap[$server.serverId], data }),
        );

      emit(Event.WELCOME);
    };

    const getSocket = () => System.serverSocket.getClient($server.clientId);
    const emit = <Data extends unknown>(
      event: Event,
      data: Data = {} as Data,
    ) => getSocket().emit(event, data);

    const getObject = () => $server;

    return {
      getId,
      getHostname,

      load,

      getSocket,
      emit,

      getObject,
    };
  };

  const add = (server: Server) => {
    $serverMap[server.serverId] = $getServer(server)!;
  };

  const remove = (server: Server) => {
    const $server = $serverMap[server.serverId];
    if (!$server) return;

    delete $serverMap[server.serverId];
  };

  const get = ({
    clientId,
    serverId,
  }: Partial<Pick<Server, "serverId" | "clientId">>) => {
    if (serverId) return $serverMap[serverId];
    if (clientId)
      return getList().find(
        (server) => server.getObject().clientId === clientId,
      );
    return null;
  };

  const getList = () => Object.values($serverMap);

  return {
    getHostname,

    add,
    get,
    getList,
    remove,
  };
};
