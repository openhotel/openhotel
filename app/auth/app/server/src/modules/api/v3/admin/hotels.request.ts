import {
  RequestType,
  RequestMethod,
  getResponse,
  HttpStatusCode,
} from "@oh/utils";
import { System } from "modules/system/main.ts";
import { RequestKind } from "shared/enums/request.enums.ts";

export const hotelsGetRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/hotels",
  kind: RequestKind.ADMIN,
  func: async (request: Request) => {
    const hotels = await System.hotels.getHotelList();

    const hotelsList = await Promise.all(
      hotels.map(async (hotel) => {
        const hotelData = hotel.getObject();
        const accounts = await hotel.getAccounts();

        hotelData.integrations = await Promise.all(
          hotel.getIntegrations().map(async (integration) => {
            const accounts = await integration.getAccounts();
            return {
              ...integration.getObject(),
              accounts: accounts.map(
                (account) => account.getObject().accountId,
              ),
            };
          }),
        );
        return {
          ...hotelData,
          accounts: accounts.map((account) => account.getObject().accountId),
        };
      }),
    );

    return getResponse(HttpStatusCode.OK, {
      data: {
        hotels: hotelsList,
      },
    });
  },
};

export const hotelsDeleteRequest: RequestType = {
  method: RequestMethod.DELETE,
  pathname: "/hotels",
  kind: RequestKind.ADMIN,
  func: async (request: Request, url: URL) => {
    const hotelId = url.searchParams.get("hotelId");
    const hotel = await System.hotels.getHotel({ hotelId });
    await hotel.remove();

    return getResponse(HttpStatusCode.OK);
  },
};
