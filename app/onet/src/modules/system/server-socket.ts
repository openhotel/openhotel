import { getServerSocket, ServerClient } from "@da/socket";
import { RequestMethod } from "@oh/utils";
import { System } from "modules/system/main.ts";
import { HotelData } from "shared/types/hotel.types.ts";

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
        protocols: [currentHotelId, licenseToken],
      }: {
        clientId: string;
        protocols: string[];
        headers: Headers;
      }) => {
        let $hotelId;
        let $accountId;
        let $integrationId;

        let $hotelData;

        try {
          const { hotelId, accountId, integrationId } =
            await System.auth.fetch<any>({
              method: RequestMethod.GET,
              pathname: "/hotel/license",
              headers: {
                "license-token": licenseToken,
              },
            });
          if (hotelId !== currentHotelId) return false;

          $hotelId = hotelId;
          $accountId = accountId;
          $integrationId = integrationId;

          $hotelData = (await System.auth.fetch<any>({
            method: RequestMethod.GET,
            pathname: `/hotel?hotelId=${$hotelId}&integrationId=${$integrationId}`,
          })) as HotelData;

          //TODO
          // if($hotelData.type !== 'client') throw 'Integration is not '
        } catch (e) {
          return false;
        }

        const foundServer = System.hotels.get({ hotelId: $hotelId });
        if (foundServer) foundServer.getSocket()?.close();

        System.hotels.add({
          licenseToken,
          clientId,

          hotelId: $hotelId,
          accountId: $accountId,
          integrationId: $integrationId,

          hotelData: $hotelData,
        });
        return true;
      },
    );
    $server.on("connected", (client: ServerClient) => {
      const foundServer = System.hotels.get({ clientId: client.id });
      if (!foundServer) client.close();

      serverClientMap[client.id] = client;
      foundServer!.load();
    });
    $server.on("disconnected", (client: ServerClient) => {
      delete serverClientMap[client.id];

      const foundServer = System.hotels.get({ clientId: client.id });
      console.log(
        `>: bye '${foundServer?.getHotelData()?.name}' (${foundServer?.getHotelId()})`,
      );
      if (!foundServer) return;

      System.hotels.remove(foundServer.getObject());
    });
  };

  const getClient = (clientId: string): ServerClient =>
    serverClientMap[clientId];

  return {
    load,

    getClient,
  };
};
