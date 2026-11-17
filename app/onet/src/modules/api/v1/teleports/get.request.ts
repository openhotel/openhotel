import { System } from "modules/system/main.ts";
import { RequestType } from "@shared/types/request.types.ts";
import { RequestKind, RequestMethod } from "@shared/enums/request.enums.ts";
import { getResponse } from "@shared/utils/response.utils.ts";
import { HttpStatusCode } from "@shared/enums/http-status-code.enums.ts";

export const getRequest: RequestType<unknown> = {
  method: RequestMethod.GET,
  pathname: "/get",
  kind: RequestKind.TOKEN,
  func: async (request, url) => {
    const teleportId = url.searchParams.get("teleportId");
    if (!teleportId) return getResponse(HttpStatusCode.FORBIDDEN);

    const teleport = await System.teleports.get(teleportId);
    if (!teleport) return getResponse(HttpStatusCode.NOT_FOUND);

    return getResponse(HttpStatusCode.OK, {
      teleport,
    });
  },
};
