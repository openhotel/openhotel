import {
  RequestType,
  RequestMethod,
  getResponse,
  HttpStatusCode,
} from "@oh/utils";
import { System } from "modules/system/main.ts";
import { RequestKind } from "shared/enums/request.enums.ts";

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
