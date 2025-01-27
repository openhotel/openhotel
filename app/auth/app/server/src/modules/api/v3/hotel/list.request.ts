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

    const hotels = (
      await Promise.all(
        $hotels
          .filter((hotel) => hotel.public)
          .map(async (hotel) => {
            const owner = await System.accounts.get(hotel.accountId);
            const client = hotel.integrations.find(
              (integration) => integration.type === "client",
            );
            const web = hotel.integrations.find(
              (integration) => integration.type === "web",
            );

            const accounts = [
              ...new Set(
                [
                  ...(client
                    ? await System.hotels.getAccountsByIntegrationId(
                        hotel.hotelId,
                        client.integrationId,
                      )
                    : []),
                  ...(web
                    ? await System.hotels.getAccountsByIntegrationId(
                        hotel.hotelId,
                        web.integrationId,
                      )
                    : []),
                ].map(({ value }) => value.accountId),
              ),
            ];

            //if hotel is a ghost town, filter it out
            if ((!client && !web) || accounts.length === 0) return null;

            return {
              id: hotel.hotelId,
              name: hotel.name,
              owner: owner.username,
              accounts: accounts.length,
              createdAt: hotel.createdAt,
              client: client
                ? {
                    name: client.name,
                    url: client.redirectUrl,
                  }
                : null,
              web: web
                ? {
                    name: web.name,
                    url: web.redirectUrl,
                  }
                : null,
            };
          }),
      )
    ).filter(Boolean);
    return getResponse(HttpStatusCode.OK, {
      data: {
        hotels,
      },
    });
  },
};
