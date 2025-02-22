import {
  RequestType,
  RequestMethod,
  getResponse,
  HttpStatusCode,
  RequestKind,
} from "@oh/utils";

export const checkGetRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/check",
  kind: RequestKind.TOKEN,
  func: async (request: Request) => {
    return getResponse(HttpStatusCode.OK, { data: { valid: true } });
  },
};
