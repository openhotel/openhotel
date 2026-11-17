import { getHotelFromRequest } from "shared/utils/request.utils.ts";
import { System } from "modules/system/main.ts";
import { Scope } from "shared/enums/scope.enums.ts";
import { RequestType } from "@shared/types/request.types.ts";
import { RequestKind, RequestMethod } from "@shared/enums/request.enums.ts";
import { getResponse } from "@shared/utils/response.utils.ts";
import { HttpStatusCode } from "@shared/enums/http-status-code.enums.ts";

export const linkRequest: RequestType<unknown> = {
  method: RequestMethod.POST,
  pathname: "/link",
  kind: RequestKind.TOKEN,
  func: async (request) => {
    const { accountId, linkId, teleportId } = await request.json();
    if (!accountId || !linkId || !teleportId)
      return getResponse(HttpStatusCode.FORBIDDEN);

    const hotel = getHotelFromRequest(request);

    if (!(await hotel.hasAccountScopes(accountId, [Scope.ONET_TELEPORTS_LINK])))
      return getResponse(HttpStatusCode.FORBIDDEN);

    const isValid = await System.teleports.link(
      linkId,
      teleportId,
      hotel.getHotelId(),
      hotel.getIntegrationId(),
    );

    return getResponse(isValid ? HttpStatusCode.OK : HttpStatusCode.CONFLICT);
  },
};
