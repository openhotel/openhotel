import { System } from "system/main.ts";
import { RequestType } from "@shared/types/request.types.ts";
import { RequestMethod } from "@shared/enums/request.enums.ts";

export const versionRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/version",
  func: () => {
    return getResponse(HttpStatusCode.OK, {
      data: {
        version: System.getEnvs().version,
      },
    });
  },
};
