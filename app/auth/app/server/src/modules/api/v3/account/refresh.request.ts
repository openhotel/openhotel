import { System } from "modules/system/main.ts";
import { RequestType } from "@shared/types/request.types.ts";
import { RequestKind, RequestMethod } from "@shared/enums/request.enums.ts";
import { getResponse } from "@shared/utils/response.utils.ts";
import { HttpStatusCode } from "@shared/enums/http-status-code.enums.ts";

export const refreshGetRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/refresh",
  kind: RequestKind.ACCOUNT_REFRESH,
  func: async (request: Request) => {
    const account = await System.accounts.getAccount({ request });

    const $refreshToken = request.headers.get("refresh-token");
    const tokenId = $refreshToken.substring(0, 4);

    await account.removeToken(tokenId);
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
