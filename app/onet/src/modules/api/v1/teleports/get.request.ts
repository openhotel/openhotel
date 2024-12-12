import {
  getResponse,
  HttpStatusCode,
  RequestMethod,
  RequestType,
} from "@oh/utils";
import {
  getHotelFromRequest,
  isRequestAuthenticated,
} from "shared/utils/request.utils.ts";
import { System } from "modules/system/main.ts";
import { Scope } from "shared/enums/scope.enums.ts";

export const getRequest: RequestType<unknown> = {
  method: RequestMethod.GET,
  pathname: "/get",
  func: async (request, url) => {
    if (!isRequestAuthenticated(request))
      return getResponse(HttpStatusCode.FORBIDDEN);

    const teleportId = url.searchParams.get("teleportId");

    if (!teleportId) return getResponse(HttpStatusCode.FORBIDDEN);

    const teleport = await System.teleports.get(teleportId);

    if (!teleport) return getResponse(HttpStatusCode.NOT_FOUND);

    return getResponse(HttpStatusCode.OK, {
      teleport,
    });
  },
};
