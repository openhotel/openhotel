import { System } from "modules/system/main.ts";
import { RequestType } from "@shared/types/request.types.ts";
import { RequestKind, RequestMethod } from "@shared/enums/request.enums.ts";
import { getResponse } from "@shared/utils/response.utils.ts";
import { HttpStatusCode } from "@shared/enums/http-status-code.enums.ts";

export const updatePatchRequest: RequestType = {
  method: RequestMethod.PATCH,
  pathname: "/update",
  kind: RequestKind.ADMIN,
  func: async (request: Request) => {
    const { version } = System.getEnvs();

    const canUpdate = System.updater.update({
      version,
      target: "latest",
      preReleases: true,
      stopOnUpdate: true,
    });

    if (!canUpdate) return getResponse(HttpStatusCode.ALREADY_REPORTED);

    setTimeout(() => {
      System.stop();
    }, 100);

    return getResponse(HttpStatusCode.OK);
  },
};
