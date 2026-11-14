import {
  getResponse,
  HttpStatusCode,
  RequestMethod,
  RequestType,
  RequestKind,
} from "@oh/utils";
import { System } from "modules/system/main.ts";

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
