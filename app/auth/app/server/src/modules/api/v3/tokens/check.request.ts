import { RequestType } from "@shared/types/request.types.ts";
import { RequestKind, RequestMethod } from "@shared/enums/request.enums.ts";
import { getResponse } from "@shared/utils/response.utils.ts";
import { HttpStatusCode } from "@shared/enums/http-status-code.enums.ts";

export const checkGetRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/check",
  kind: RequestKind.TOKEN,
  func: async (request: Request) => {
    return getResponse(HttpStatusCode.OK, { data: { valid: true } });
  },
};
