import {
  RequestType,
  RequestMethod,
  getResponse,
  HttpStatusCode,
  RequestKind,
} from "@oh/utils";
import { System } from "modules/system/main.ts";

export const mainGetRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "",
  kind: RequestKind.PUBLIC,
  func: async (request: Request, url: URL) => {
    const hotelId = url.searchParams.get("hotelId");
    const integrationId = url.searchParams.get("integrationId");

    if (!hotelId || !integrationId)
      return getResponse(HttpStatusCode.BAD_REQUEST);

    const hotel = await System.hotels.getHotel({ hotelId });
    if (!hotel || hotel.getObject().blocked)
      return getResponse(HttpStatusCode.BAD_REQUEST);

    const integration = hotel.getIntegration({ integrationId });
    if (!integration) return getResponse(HttpStatusCode.BAD_REQUEST);

    const ownerAccount = await hotel.getOwner();
    const hotelData = hotel.getObject();
    const accounts = await hotel.getAccounts();
    const integrationData = integration.getObject();

    return getResponse(HttpStatusCode.OK, {
      data: {
        name: hotelData.name,
        owner: ownerAccount.getObject().username,
        accounts: accounts.length,
        redirectUrl: integrationData.redirectUrl,
        type: integrationData.type,
      },
    });
  },
};
