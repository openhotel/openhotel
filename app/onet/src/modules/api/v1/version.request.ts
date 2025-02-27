import {
  RequestType,
  RequestMethod,
  getResponse,
  HttpStatusCode,
  RequestKind,
} from "@oh/utils";
import { System } from "modules/system/main.ts";

export const versionRequest: RequestType<unknown> = {
  method: RequestMethod.GET,
  pathname: "/version",
  kind: RequestKind.PUBLIC,
  func: () => {
    return getResponse(HttpStatusCode.OK, {
      data: { version: System.getEnvs().version },
    });
  },
};
