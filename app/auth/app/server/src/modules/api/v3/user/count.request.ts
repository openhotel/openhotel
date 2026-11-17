import { System } from "modules/system/main.ts";
import { RequestType } from "@shared/types/request.types.ts";
import { RequestKind, RequestMethod } from "@shared/enums/request.enums.ts";
import { getResponse } from "@shared/utils/response.utils.ts";
import { HttpStatusCode } from "@shared/enums/http-status-code.enums.ts";

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
