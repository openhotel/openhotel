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
  kind: RequestKind.PUBLIC,
  func: async (request, url) => {
    const hotelId = url.searchParams.get("hotelId");
    const integrationId = url.searchParams.get("integrationId");

    if (!hotelId || !integrationId)
      return getResponse(HttpStatusCode.BAD_REQUEST);

    const hotel = await System.hotels.get(hotelId);
    if (!hotel) return getResponse(HttpStatusCode.BAD_REQUEST);

    const foundIntegration = hotel.integrations.find(
      (integration) => integration.integrationId === integrationId,
    );
    if (!foundIntegration) return getResponse(HttpStatusCode.BAD_REQUEST);

    const ownerAccount = await System.accounts.get(hotel.accountId);

    return getResponse(HttpStatusCode.OK, {
      data: {
        name: hotel.name,
        owner: ownerAccount.username,
        redirectUrl: foundIntegration.redirectUrl,
        type: foundIntegration.type,
      },
    });
  },
};
