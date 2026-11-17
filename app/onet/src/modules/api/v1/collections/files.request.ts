import { System } from "modules/system/main.ts";
import { COLLECTION_FILE_URL_EXPIRY_SECONDS } from "shared/consts/main.ts";
import { RequestType } from "@shared/types/request.types.ts";
import { RequestKind, RequestMethod } from "@shared/enums/request.enums.ts";
import { getResponse } from "@shared/utils/response.utils.ts";
import { HttpStatusCode } from "@shared/enums/http-status-code.enums.ts";

export const filesRequest: RequestType<unknown> = {
  method: RequestMethod.GET,
  pathname: "/files",
  kind: RequestKind.TOKEN,
  func: async (request, url) => {
    const id = url.searchParams.get("id");
    const version = Number(url.searchParams.get("version"));
    const furniture = url.searchParams.get("furniture"); // "furni1,furni2,..."

    if (!id || !Number.isInteger(version) || version < 1)
      return getResponse(HttpStatusCode.BAD_REQUEST);

    if (!System.collections.isBucketEnabled())
      return getResponse(HttpStatusCode.SERVICE_UNAVAILABLE);

    const manifest = await System.collections.getManifest(id, version);
    if (!manifest) return getResponse(HttpStatusCode.NOT_FOUND);

    const manifestFurnitureIds = manifest.furniture.map(({ id }) => id);
    const furnitureIds = furniture
      ? [...new Set(furniture.split(","))]
      : manifestFurnitureIds;

    if (
      furnitureIds.some(
        (furnitureId) => !manifestFurnitureIds.includes(furnitureId),
      )
    )
      return getResponse(HttpStatusCode.NOT_FOUND);

    const files: Record<string, string> = {};
    for (const furnitureId of furnitureIds) {
      files[furnitureId] = await System.collections.getFileUrl(
        id,
        version,
        furnitureId,
        COLLECTION_FILE_URL_EXPIRY_SECONDS,
      );
    }

    return getResponse(HttpStatusCode.OK, {
      files,
      expiresIn: COLLECTION_FILE_URL_EXPIRY_SECONDS,
    });
  },
};
