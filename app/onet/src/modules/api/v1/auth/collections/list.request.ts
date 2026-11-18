import { System } from "modules/system/main.ts";
import { RequestType } from "@shared/types/request.types.ts";
import { RequestKind, RequestMethod } from "@shared/enums/request.enums.ts";
import { getResponse } from "@shared/utils/response.utils.ts";
import { HttpStatusCode } from "@shared/enums/http-status-code.enums.ts";

export const listRequest: RequestType<unknown> = {
  method: RequestMethod.GET,
  pathname: "",
  kind: RequestKind.APPS,
  func: async (request, url) => {
    const accountId = url.searchParams.get("accountId");
    if (!accountId) return getResponse(HttpStatusCode.BAD_REQUEST);

    const collectionList = await System.collections.getList();
    const accountCollections = collectionList.filter(
      (collection) => collection.accountId === accountId,
    );

    const collections = [];
    for (const collection of accountCollections) {
      const manifest = collection.latestVersion
        ? await System.collections.getManifest(
            collection.id,
            collection.latestVersion,
          )
        : null;

      collections.push({
        id: collection.id,
        category: manifest?.category ?? null,
        latestVersion: collection.latestVersion,
        furnitureCount: manifest?.furniture.length ?? 0,
        createdAt: collection.createdAt,
        updatedAt: collection.updatedAt,
      });
    }

    collections.sort((a, b) => a.id.localeCompare(b.id));

    return getResponse(HttpStatusCode.OK, { data: { collections } });
  },
};
