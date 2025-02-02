import {
  RequestType,
  RequestMethod,
  getResponse,
  HttpStatusCode,
} from "@oh/utils";
import { System } from "modules/system/main.ts";
import { RequestKind } from "shared/enums/request.enums.ts";

export const refreshGetRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/refresh",
  kind: RequestKind.ACCOUNT,
  func: async (request: Request) => {
    const account = await System.accounts.getAccount({ request });
    if (!account || !(await account.checkRefreshToken(request)))
      return getResponse(HttpStatusCode.FORBIDDEN);

    const tokens = await account.createTokens(request);

    return getResponse(HttpStatusCode.OK, {
      data: {
        accountId: account.getObject().accountId,
        token: tokens.token,
        refreshToken: tokens.refreshToken,
        durations: tokens.durations,
      },
    });
  },
};
