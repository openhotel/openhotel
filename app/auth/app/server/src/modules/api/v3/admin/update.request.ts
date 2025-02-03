import {
  RequestType,
  RequestMethod,
  update,
  getResponse,
  HttpStatusCode,
} from "@oh/utils";
import { System } from "modules/system/main.ts";
import { RequestKind } from "shared/enums/request.enums.ts";

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

    await System.db.backup("_update");

    setTimeout(() => {
      Deno.exit();
    }, 100);

    return getResponse(HttpStatusCode.OK);
  },
};
