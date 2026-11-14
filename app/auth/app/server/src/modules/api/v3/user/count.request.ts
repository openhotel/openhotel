import {
  RequestType,
  RequestMethod,
  getResponse,
  HttpStatusCode,
  RequestKind,
} from "@oh/utils";
import { System } from "modules/system/main.ts";

export const countRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/count",
  kind: RequestKind.PUBLIC,
  func: async () => {
    const accounts = await System.accounts.getAccountList();
    return getResponse(HttpStatusCode.OK, {
      data: {
        count: accounts.length,
      },
    });
  },
};
