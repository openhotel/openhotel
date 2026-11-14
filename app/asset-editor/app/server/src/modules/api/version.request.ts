import { System } from "system/main.ts";
import { RequestType, RequestMethod } from "@oh/utils";

export const versionRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/version",
  func: (request, url) => {
    return Response.json(
      {
        status: 200,
        data: {
          version: System.getEnvs().version,
        },
      },
      { status: 200 },
    );
  },
};
