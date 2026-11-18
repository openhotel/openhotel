import { System } from "modules/system/main.ts";
import { RequestType } from "@shared/types/request.types.ts";
import { RequestKind, RequestMethod } from "@shared/enums/request.enums.ts";
import { getResponse } from "@shared/utils/response.utils.ts";
import { HttpStatusCode } from "@shared/enums/http-status-code.enums.ts";

export const manifestRequest: RequestType<unknown> = {
  method: RequestMethod.GET,
  pathname: "/manifest",
  kind: RequestKind.TOKEN,
  func: async (request, url) => {
    const id = url.searchParams.get("id");

    if (!id) return getResponse(HttpStatusCode.BAD_REQUEST);

    const manifest = await System.collections.getLatestManifest(id);
    if (!manifest) return getResponse(HttpStatusCode.NOT_FOUND);

    return getResponse(HttpStatusCode.OK, { manifest });
  },
};
