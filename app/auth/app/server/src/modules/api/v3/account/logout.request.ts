import { System } from "modules/system/main.ts";
import { RequestType } from "@shared/types/request.types.ts";
import { RequestKind, RequestMethod } from "@shared/enums/request.enums.ts";
import { getResponse } from "@shared/utils/response.utils.ts";
import { HttpStatusCode } from "@shared/enums/http-status-code.enums.ts";

export const logoutPostRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "/logout",
  kind: RequestKind.ACCOUNT,
  func: async (request: Request) => {
    const account = await System.accounts.getAccount({ request });

    await account.removeToken(request.headers.get("token"));

    return getResponse(HttpStatusCode.OK);
  },
};
