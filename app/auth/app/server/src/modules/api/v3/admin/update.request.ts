import { System } from "modules/system/main.ts";
import { RequestType } from "@shared/types/request.types.ts";
import { RequestKind, RequestMethod } from "@shared/enums/request.enums.ts";
import { update } from "@shared/modules/old/updater.ts";
import { getResponse } from "@shared/utils/response.utils.ts";
import { HttpStatusCode } from "@shared/enums/http-status-code.enums.ts";

export const updatePatchRequest: RequestType = {
  method: RequestMethod.PATCH,
  pathname: "/update",
  kind: RequestKind.ADMIN,
  func: async (request: Request) => {
    const { version } = System.getEnvs();

    const canUpdate =
      version !== "development" &&
      (await update({
        targetVersion: "latest",
        version,
        repository: "openhotel/auth",
        log: console.log,
        debug: console.debug,
      }));

    if (!canUpdate) return getResponse(HttpStatusCode.ALREADY_REPORTED);

    setTimeout(() => {
      System.stop();
    }, 100);

    return getResponse(HttpStatusCode.OK);
  },
};
