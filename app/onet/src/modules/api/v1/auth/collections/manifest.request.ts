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
  kind: RequestKind.APPS,
  func: async (request, url) => {
    const id = url.searchParams.get("id");
    const accountId = url.searchParams.get("accountId");

    if (!id || !accountId) return getResponse(HttpStatusCode.BAD_REQUEST);

    const collection = await System.collections.get(id);
    if (collection?.accountId !== accountId) {
      return getResponse(HttpStatusCode.NOT_FOUND);
    }

    const manifest = await System.collections.getLatestManifest(id);
    if (!manifest) {
      return getResponse(HttpStatusCode.NOT_FOUND);
    }

    return getResponse(HttpStatusCode.OK, { data: { manifest } });
  },
};
