import {
  RequestType,
  RequestMethod,
  getResponse,
  HttpStatusCode,
} from "@oh/utils";
import { RequestKind } from "shared/enums/request.enums.ts";
import { System } from "modules/system/main.ts";

export const checkGetRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/check",
  kind: RequestKind.PUBLIC,
  func: async (request: Request) => {
    const appToken = request.headers.get("app-token");

    if (!appToken) return getResponse(HttpStatusCode.BAD_REQUEST);

    const valid = await System.tokens.verify(appToken);

    return getResponse(HttpStatusCode.OK, { data: { valid } });
  },
};
