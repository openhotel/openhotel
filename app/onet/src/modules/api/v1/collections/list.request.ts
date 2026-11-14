import {
  getResponse,
  HttpStatusCode,
  RequestMethod,
  RequestType,
  RequestKind,
} from "@oh/utils";
import { System } from "modules/system/main.ts";

export const listRequest: RequestType<unknown> = {
  method: RequestMethod.GET,
  pathname: "",
  kind: RequestKind.TOKEN,
  func: async (request, url) => {
    const query = url.searchParams.get("query")?.trim().toLowerCase() ?? "";

    const collectionList = await System.collections.getList();
    const publishedCollections = collectionList.filter(
      ({ latestVersion }) => latestVersion > 0,
    );

    const summaries = [];
    for (const collection of publishedCollections) {
      const manifest = await System.collections.getManifest(
        collection.id,
        collection.latestVersion,
      );
      if (!manifest) {
        continue;
      }

      if (
        query &&
        !collection.id.includes(query) &&
        !manifest.category.label.toLowerCase().includes(query)
      ) {
        continue;
      }

      summaries.push({
        id: collection.id,
        author: manifest.author,
        version: manifest.version,
        license: manifest.license,
        minHotelVersion: manifest.minHotelVersion,
        category: manifest.category,
        furnitureCount: manifest.furniture.length,
        updatedAt: collection.updatedAt,
      });
    }

    summaries.sort((a, b) => a.id.localeCompare(b.id));

    return getResponse(HttpStatusCode.OK, {
      collections: summaries,
    });
  },
};
