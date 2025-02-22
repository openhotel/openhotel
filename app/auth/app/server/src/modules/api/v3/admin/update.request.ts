import {
  RequestType,
  RequestMethod,
  update,
  getResponse,
  HttpStatusCode,
  RequestKind,
} from "@oh/utils";
import { System } from "modules/system/main.ts";

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
