import { getServerSocket, ServerClient } from "@da/socket";
import { System } from "modules/system/main.ts";

export const serverSocket = () => {
  let $server;
  const serverClientMap: Record<string, ServerClient> = {};

  const load = (
    port: number,
    onRequest: (
      $request: Request,
      connInfo: Deno.ServeHandlerInfo,
    ) => Promise<Response> | Response,
  ) => {
    $server = getServerSocket(port, onRequest);
    console.log(`Started on :${port}`);

    $server.on(
      "guest",
      async (
        clientId: string,
        [serverId, token]: string[],
        connInfo: Deno.ServeHandlerInfo,
      ) => {
        const ip = connInfo.remoteAddr.hostname;

        //server is already logged
        if (System.servers.get({ serverId })) return false;

        const hostname = await System.servers.getHostname(serverId, token, ip);
        if (!hostname) return false;

        System.servers.add({
          clientId,
          serverId,
          ip,
          hostname,
          token,
        });
        return true;
      },
    );
    $server.on("connected", (client: ServerClient) => {
      const foundServer = System.servers.get({ clientId: client.id });
      if (!foundServer) client.close();

      serverClientMap[client.id] = client;
      foundServer!.load();
    });
    $server.on("disconnected", (client: ServerClient) => {
      delete serverClientMap[client.id];

      const foundServer = System.servers.get({ clientId: client.id });
      if (!foundServer) return;

      System.servers.remove(foundServer.getObject());
    });
  };

  const getClient = (clientId: string): ServerClient =>
    serverClientMap[clientId];

  return {
    load,

    getClient,
  };
};
