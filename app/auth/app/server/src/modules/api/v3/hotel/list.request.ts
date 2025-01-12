import {
  RequestType,
  RequestMethod,
  getResponse,
  HttpStatusCode,
} from "@oh/utils";
import { System } from "modules/system/main.ts";
import { RequestKind } from "shared/enums/request.enums.ts";

export const listRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/list",
  kind: RequestKind.PUBLIC,
  func: async () => {
    const $hotels = await System.hotels.getList();
    const hotels = await Promise.all(
      $hotels.map(async (hotel) => {
        const owner = await System.accounts.get(hotel.accountId);
        const client = hotel.integrations.find(
          (integration) => integration.type === "client",
        );
        const web = hotel.integrations.find(
          (integration) => integration.type === "web",
        );

        const clientAccounts = client
          ? (
              await System.hotels.getAccountsByIntegrationId(
                hotel.hotelId,
                client.integrationId,
              )
            ).length
          : 0;
        const webAccounts = web
          ? (
              await System.hotels.getAccountsByIntegrationId(
                hotel.hotelId,
                web.integrationId,
              )
            ).length
          : 0;

        return {
          name: hotel.name,
          owner: owner.username,
          client: client
            ? {
                name: client.name,
                url: client.redirectUrl,
                accounts: clientAccounts,
              }
            : null,
          web: web
            ? {
                name: web.name,
                url: web.redirectUrl,
                accounts: webAccounts,
              }
            : null,
        };
      }),
    );
    return getResponse(HttpStatusCode.OK, {
      data: {
        hotels,
      },
    });
  },
};
