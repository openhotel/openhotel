import {
  RequestType,
  RequestMethod,
  getResponse,
  HttpStatusCode,
  RequestKind,
} from "@oh/utils";
import { System } from "modules/system/main.ts";

export const mainDeleteRequest: RequestType = {
  method: RequestMethod.DELETE,
  pathname: "",
  kind: RequestKind.ADMIN,
  func: async (request: Request, url: URL) => {
    const hotelId = url.searchParams.get("hotelId");
    const integrationId = url.searchParams.get("integrationId");

    if (!hotelId || !integrationId)
      return getResponse(HttpStatusCode.BAD_REQUEST);

    const hotel = await System.hotels.getHotel({ hotelId });

    if (!hotel) return getResponse(HttpStatusCode.BAD_REQUEST);

    const integration = hotel.getIntegration({ integrationId });
    if (!integration) return getResponse(HttpStatusCode.BAD_REQUEST);

    await integration.remove();

    return getResponse(HttpStatusCode.OK);
  },
};
