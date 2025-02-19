import {
  RequestType,
  RequestMethod,
  getResponse,
  HttpStatusCode,
} from "@oh/utils";
import { RequestKind } from "shared/enums/request.enums.ts";

export const checkGetRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/check",
  kind: RequestKind.THIRD_PARTY,
  func: async (request: Request) => {
    return getResponse(HttpStatusCode.OK, { data: { valid: true } });
  },
};
