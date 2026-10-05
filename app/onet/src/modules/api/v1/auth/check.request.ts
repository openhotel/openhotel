import {
  RequestType,
  RequestMethod,
  getResponse,
  HttpStatusCode,
  RequestKind,
} from "@oh/utils";

export const checkRequest: RequestType<unknown> = {
  method: RequestMethod.GET,
  pathname: "/check",
  kind: RequestKind.APPS,
  func: () => {
    return getResponse(HttpStatusCode.OK, { data: { valid: true } });
  },
};
