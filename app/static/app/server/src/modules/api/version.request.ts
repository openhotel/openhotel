import { System } from "system/main.ts";
import {
  RequestType,
  RequestMethod,
  getResponse,
  HttpStatusCode,
} from "@oh/utils";

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
