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
  kind: RequestKind.ACCOUNT,
  func: async (request: Request) => {
    const account = await System.accounts.getAccount({ request });
    const $hotels = await account.getHotels();

    const hotels = (
      await Promise.all(
        $hotels.map(async (hotel) => {
          const hotelData = hotel.getObject();

          if (hotelData.blocked) return null;

          hotelData.integrations = await Promise.all(
            hotel.getIntegrations().map(async (integration) => {
              const accounts = await integration.getAccounts();
              return {
                ...integration.getObject(),
                accounts: accounts.length,
              };
            }),
          );

          const accounts = await hotel.getAccounts();
          return {
            ...hotelData,
            accounts: accounts.length,
          };
        }),
      )
    ).filter((hotel) => Boolean(hotel));

    return getResponse(HttpStatusCode.OK, {
      data: { hotels },
    });
  },
};

export const mainPostRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "",
  kind: RequestKind.ACCOUNT,
  func: async (request: Request) => {
    try {
      const { name, public: $public } = await request.json();

      if (!name) return getResponse(HttpStatusCode.BAD_REQUEST);

      const account = await System.accounts.getAccount({ request });
      const hotelId = await account.createHotel({
        name,
        public: Boolean($public),
      });

      if (!hotelId) return getResponse(HttpStatusCode.NOT_ACCEPTABLE);

      return getResponse(HttpStatusCode.OK, {
        data: {
          hotelId,
        },
      });
    } catch (e) {
      return getResponse(HttpStatusCode.BAD_REQUEST);
    }
  },
};

export const mainPatchRequest: RequestType = {
  method: RequestMethod.PATCH,
  pathname: "",
  kind: RequestKind.ACCOUNT,
  func: async (request: Request) => {
    const { hotelId, name, public: $public } = await request.json();

    if (!hotelId || !name) return getResponse(HttpStatusCode.BAD_REQUEST);

    const account = await System.accounts.getAccount({ request });

    const hotel = await account.getHotel({ hotelId });
    if (!hotel || hotel.getObject().blocked)
      return getResponse(HttpStatusCode.BAD_REQUEST);

    await hotel.update({
      name,
      public: Boolean($public),
    });

    return getResponse(HttpStatusCode.OK);
  },
};

export const mainDeleteRequest: RequestType = {
  method: RequestMethod.DELETE,
  pathname: "",
  kind: RequestKind.ACCOUNT,
  func: async (request: Request, url: URL) => {
    const hotelId = url.searchParams.get("hotelId");
    if (!hotelId) return getResponse(HttpStatusCode.BAD_REQUEST);

    const account = await System.accounts.getAccount({ request });

    const hotel = await account.getHotel({ hotelId });
    if (!hotel || hotel.getObject().blocked)
      return getResponse(HttpStatusCode.BAD_REQUEST);

    await hotel.remove();

    return getResponse(HttpStatusCode.OK);
  },
};
