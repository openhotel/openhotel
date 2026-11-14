import {
  getResponse,
  HttpStatusCode,
  RequestMethod,
  RequestType,
  RequestKind,
} from "@oh/utils";
import { System } from "modules/system/main.ts";

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
