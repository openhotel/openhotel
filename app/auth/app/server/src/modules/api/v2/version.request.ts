import { RequestType, RequestMethod } from "@oh/utils";
import { System } from "modules/system/main.ts";

export const versionRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/version",
  func: (request, url) => {
    return Response.json(
      { version: System.getEnvs().version },
      { status: 200 },
    );
  },
};
