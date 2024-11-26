import { RequestType, RequestMethod } from "@oh/utils";
import { System } from "modules/system/main.ts";
import { RequestKind } from "shared/enums/request.enums.ts";

export const versionRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/version",
  kind: RequestKind.PUBLIC,
  func: (request, url) => {
    return Response.json(
      { status: 200, data: { version: System.getEnvs().version } },
      { status: 200 },
    );
  },
};
