import {
  RequestType,
  RequestMethod,
  getResponse,
  HttpStatusCode,
} from "@oh/utils";
import { System } from "modules/system/main.ts";
import { RequestKind } from "shared/enums/request.enums.ts";

export const versionRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/version",
  kind: RequestKind.PUBLIC,
  func: () => {
    return getResponse(HttpStatusCode.OK, {
      data: {
        version: System.getEnvs().version,
      },
    });
  },
};
