import {
  RequestType,
  RequestMethod,
  getRandomString,
  compareIps,
  getIpFromRequest,
  getResponse,
  HttpStatusCode,
} from "@oh/utils";
import { System } from "modules/system/main.ts";
import * as bcrypt from "@da/bcrypt";
import { RequestKind } from "shared/enums/request.enums.ts";
import { hasRequestAccess } from "shared/utils/scope.utils.ts";

export const refreshGetRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/refresh",
  kind: RequestKind.ACCOUNT,
  func: async (request: Request) => {
    const accountId = request.headers.get("account-id");
    let refreshToken = request.headers.get("refresh-token");

    if (await hasRequestAccess({ request }))
      return getResponse(HttpStatusCode.OK);

    if (!accountId || !refreshToken)
      return getResponse(HttpStatusCode.FORBIDDEN);

    const accountByRefreshToken = await System.db.get([
      "accountsByRefreshToken",
      accountId,
    ]);

    if (!accountByRefreshToken) return getResponse(HttpStatusCode.FORBIDDEN);

    const userAgent = request.headers.get("user-agent");
    const ip = getIpFromRequest(request);

    if (
      accountByRefreshToken.userAgent !== userAgent ||
      !compareIps(ip, accountByRefreshToken.ip)
    )
      return getResponse(HttpStatusCode.FORBIDDEN);

    const account = await System.db.get(["accounts", accountId]);

    if (!account) return getResponse(HttpStatusCode.FORBIDDEN);

    const result = bcrypt.compareSync(
      refreshToken,
      accountByRefreshToken.refreshTokenHash,
    );

    if (!result) return getResponse(HttpStatusCode.FORBIDDEN);

    const token = getRandomString(54);
    refreshToken = getRandomString(64);

    const {
      times: { accountTokenDays, accountRefreshTokenDays },
    } = System.getConfig();
    const expireInToken = accountTokenDays * 24 * 60 * 60 * 1000;
    const expireInRefreshToken = accountRefreshTokenDays * 24 * 60 * 60 * 1000;

    await System.db.set(
      ["accountsByToken", account.accountId],
      {
        userAgent,
        ip,
        tokenHash: bcrypt.hashSync(token, bcrypt.genSaltSync(8)),
      },
      {
        expireIn: expireInToken,
      },
    );
    await System.db.set(
      ["accountsByRefreshToken", account.accountId],
      {
        userAgent,
        ip,
        refreshTokenHash: bcrypt.hashSync(refreshToken, bcrypt.genSaltSync(8)),
      },
      { expireIn: expireInRefreshToken },
    );

    return getResponse(HttpStatusCode.OK, {
      data: {
        accountId: account.accountId,
        token,
        refreshToken,
        durations: [accountTokenDays, accountRefreshTokenDays],
      },
    });
  },
};
