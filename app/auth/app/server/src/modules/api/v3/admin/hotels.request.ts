import {
  RequestType,
  RequestMethod,
  getResponse,
  HttpStatusCode,
} from "@oh/utils";
import { hasRequestAccess } from "shared/utils/scope.utils.ts";
import { System } from "modules/system/main.ts";
import { RequestKind } from "shared/enums/request.enums.ts";

export const hotelsGetRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/hotels",
  kind: RequestKind.ADMIN,
  func: async (request: Request) => {
    if (!(await hasRequestAccess({ request, admin: true })))
      return getResponse(HttpStatusCode.FORBIDDEN);

    const hotels = await System.hotels.getList();
    for (const hotel of hotels) {
      for (const integration of hotel.integrations) {
        integration.connections =
          await System.connections.getListByHotelIdIntegrationId(
            hotel.hotelId,
            integration.integrationId,
          );
      }
    }

    return getResponse(HttpStatusCode.OK, {
      data: {
        hotels,
      },
    });
  },
};

export const hotelsDeleteRequest: RequestType = {
  method: RequestMethod.DELETE,
  pathname: "/hotels",
  kind: RequestKind.ADMIN,
  func: async (request: Request, url: URL) => {
    if (!(await hasRequestAccess({ request, admin: true })))
      return getResponse(HttpStatusCode.FORBIDDEN);

    const hotelId = url.searchParams.get("hotelId");
    await System.hotels.remove(hotelId);

    return getResponse(HttpStatusCode.OK);
  },
};
