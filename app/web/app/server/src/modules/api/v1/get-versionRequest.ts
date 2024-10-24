import { RequestType, RequestMethod } from "@oh/utils";
import { System } from "modules/system/main.ts";

export const getVersionRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/version",
  func: (request, url) => {
    return Response.json(
      { status: 200, data: { version: System.getEnvs().version } },
      { status: 200 },
    );
  },
};
