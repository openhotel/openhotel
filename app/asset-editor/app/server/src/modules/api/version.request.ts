import { RequestType } from "shared/types/main.ts";
import { RequestMethod } from "shared/enums/main.ts";

export const versionRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/version",
  func: (request, url) => {
    return Response.json({}, { status: 200 });
  },
};
