import {
  RequestType,
  RequestMethod,
  getResponse,
  HttpStatusCode,
} from "@oh/utils";
import { RequestKind } from "shared/enums/request.enums.ts";
import { hasAppTokenAccess } from "shared/utils/tokens.utils.ts";

export const checkGetRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/check",
  kind: RequestKind.TOKEN,
  func: async (request: Request) => {
    if (!(await hasAppTokenAccess(request)))
      return getResponse(HttpStatusCode.FORBIDDEN);

    return getResponse(HttpStatusCode.OK, { data: { valid: true } });
  },
};
