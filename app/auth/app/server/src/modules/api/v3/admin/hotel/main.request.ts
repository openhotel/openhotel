import {
  RequestType,
  RequestMethod,
  getResponse,
  HttpStatusCode,
} from "@oh/utils";
import { RequestKind } from "shared/enums/request.enums.ts";
import { System } from "modules/system/main.ts";

export const mainGetRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "",
  kind: RequestKind.ADMIN,
  func: async (request: Request) => {
    const hotels = await System.hotels.getHotelList();

    const $hotels = await Promise.all(
      hotels.map(async (hotel) => {
        const hotelData = hotel.getObject();

        return {
          ...hotelData,
          username: (
            await System.accounts.getAccount({ accountId: hotelData.accountId })
          ).getObject().username,
          accounts: (await hotel.getAccounts()).map((account) => {
            const { accountId, username } = account.getObject();
            return {
              accountId,
              username,
            };
          }),
          integrations: await Promise.all(
            hotel.getIntegrations().map(async (integration) => {
              return {
                ...integration.getObject(),
                accounts: (await integration.getAccounts()).map((account) => {
                  const { accountId, username } = account.getObject();
                  return {
                    accountId,
                    username,
                  };
                }),
              };
            }),
          ),
        };
      }),
    );

    return getResponse(HttpStatusCode.OK, {
      data: {
        hotels: $hotels,
      },
    });
  },
};

export const mainPatchRequest: RequestType = {
  method: RequestMethod.PATCH,
  pathname: "",
  kind: RequestKind.ADMIN,
  func: async (request: Request) => {
    const { hotelId, blocked, verified, official } = await request.json();

    if (!hotelId) return getResponse(HttpStatusCode.BAD_REQUEST);

    const hotel = await System.hotels.getHotel({ hotelId });
    if (!hotel) return getResponse(HttpStatusCode.BAD_REQUEST);

    const hotelData = {} as any;
    if (blocked !== undefined) hotelData.blocked = Boolean(blocked);
    if (verified !== undefined) hotelData.verified = Boolean(verified);
    if (official !== undefined) hotelData.official = Boolean(official);

    await hotel.update(hotelData);

    return getResponse(HttpStatusCode.OK);
  },
};

export const mainDeleteRequest: RequestType = {
  method: RequestMethod.DELETE,
  pathname: "",
  kind: RequestKind.ADMIN,
  func: async (request: Request, url: URL) => {
    const hotelId = url.searchParams.get("hotelId");
    if (!hotelId) return getResponse(HttpStatusCode.BAD_REQUEST);

    const hotel = await System.hotels.getHotel({ hotelId });
    if (!hotel) return getResponse(HttpStatusCode.BAD_REQUEST);

    await hotel.remove();

    return getResponse(HttpStatusCode.OK);
  },
};
