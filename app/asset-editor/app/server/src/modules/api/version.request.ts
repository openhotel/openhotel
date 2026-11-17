import { System } from "system/main.ts";
import { RequestMethod } from "@shared/enums/request.enums.ts";
import { RequestType } from "@shared/types/request.types.ts";

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
