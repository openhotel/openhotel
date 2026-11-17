import { RequestType } from "@shared/types/request.types.ts";
import { RequestKind, RequestMethod } from "@shared/enums/request.enums.ts";
import { getResponse } from "@shared/utils/response.utils.ts";
import { HttpStatusCode } from "@shared/enums/http-status-code.enums.ts";

export const checkRequest: RequestType<unknown> = {
  method: RequestMethod.GET,
  pathname: "/check",
  kind: RequestKind.APPS,
  func: () => {
    return getResponse(HttpStatusCode.OK, { data: { valid: true } });
  },
};
