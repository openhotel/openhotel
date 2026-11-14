import {
  getResponse,
  HttpStatusCode,
  RequestMethod,
  RequestType,
  RequestKind,
} from "@oh/utils";
import { System } from "modules/system/main.ts";
import { DbHotelIntegrationType } from "shared/enums/hotel.enums.ts";

export const listRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/list",
  kind: RequestKind.PUBLIC,
  func: async () => {
    const $hotels = await System.hotels.getHotelList();

    const hotels = (
      await Promise.all(
        $hotels.map(async (hotel) => {
          const hotelData = hotel.getObject();

          if (!hotelData.public || hotelData.blocked) return null;

          const owner = await hotel.getOwner();

          const client = hotel
            .getIntegration({
              type: DbHotelIntegrationType.CLIENT,
            })
            ?.getObject();
          const web = hotel
            .getIntegration({
              type: DbHotelIntegrationType.WEB,
            })
            ?.getObject();

          const accounts = await hotel.getAccounts();

          //if hotel is a ghost town, filter it out
          if ((!client && !web) || accounts.length === 0) return null;

          return {
            id: hotelData.hotelId,
            name: hotelData.name,
            owner: owner.getObject().username,
            accounts: accounts.length,
            createdAt: hotelData.createdAt,
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
            official: hotelData.official,
            verified: hotelData.verified,
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
