import {
  RequestType,
  RequestMethod,
  getResponse,
  HttpStatusCode,
  RequestKind,
} from "@oh/utils";
import { System } from "modules/system/main.ts";

export const mainPostRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "",
  kind: RequestKind.ACCOUNT,
  func: async (request: Request) => {
    const { hotelId, name, redirectUrl, type } = await request.json();

    const account = await System.accounts.getAccount({ request });
    const hotel = await account.getHotel({ hotelId });

    if (!hotel || hotel.getObject().blocked)
      return getResponse(HttpStatusCode.BAD_REQUEST);

    const integrationId = await hotel.integrations.addIntegration({
      name,
      redirectUrl,
      type,
    });
    if (!integrationId) return getResponse(HttpStatusCode.BAD_REQUEST);

    return getResponse(HttpStatusCode.OK, { data: { integrationId } });
  },
};

//>:4 8 15 16 23 42
export const mainGetRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "",
  kind: RequestKind.ACCOUNT,
  func: async (request: Request, url: URL) => {
    const hotelId = url.searchParams.get("hotelId");
    const integrationId = url.searchParams.get("integrationId");

    if (!hotelId || !integrationId)
      return getResponse(HttpStatusCode.BAD_REQUEST);

    const account = await System.accounts.getAccount({ request });
    const hotel = await account.getHotel({ hotelId });
    if (!hotel || hotel.getObject().blocked)
      return getResponse(HttpStatusCode.BAD_REQUEST);

    const integration = hotel.getIntegration({ integrationId });
    if (!integration) return getResponse(HttpStatusCode.BAD_REQUEST);

    const token = await integration.generateLicense();

    return getResponse(HttpStatusCode.OK, { data: { token } });
  },
};

export const mainDeleteRequest: RequestType = {
  method: RequestMethod.DELETE,
  pathname: "",
  kind: RequestKind.ACCOUNT,
  func: async (request: Request, url: URL) => {
    const hotelId = url.searchParams.get("hotelId");
    const integrationId = url.searchParams.get("integrationId");

    if (!hotelId || !integrationId)
      return getResponse(HttpStatusCode.BAD_REQUEST);

    const account = await System.accounts.getAccount({ request });

    const hotel = await account.getHotel({ hotelId });

    if (!hotel || hotel.getObject().blocked)
      return getResponse(HttpStatusCode.BAD_REQUEST);

    const integration = hotel.getIntegration({ integrationId });
    if (!integration) return getResponse(HttpStatusCode.BAD_REQUEST);

    await integration.remove();

    return getResponse(HttpStatusCode.OK);
  },
};
