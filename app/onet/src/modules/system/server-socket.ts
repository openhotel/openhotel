import { getServerSocket, ServerClient } from "@da/socket";
import { RequestMethod, getTokenData } from "@oh/utils";
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
      async ({
        clientId,
        protocols: [licenseToken],
      }: {
        clientId: string;
        protocols: string[];
        headers: Headers;
      }) => {
        try {
          const { valid } = await System.auth.fetch<{ valid: boolean }>({
            method: RequestMethod.GET,
            pathname: "/hotels/check-license",
            headers: {
              "license-token": licenseToken,
            },
          });
          if (!valid) return false;
        } catch (e) {
          return false;
        }

        const foundServer = System.servers.get({ licenseToken });
        if (foundServer) foundServer.getSocket()?.close();

        System.servers.add({
          licenseToken,
          clientId,
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
      console.log(`- bye ${client.id} '${foundServer?.getTokenId()}'`);
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
