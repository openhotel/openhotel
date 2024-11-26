import {
  RequestType,
  RequestMethod,
  getRandomString,
  compareIps,
  getIpFromRequest,
} from "@oh/utils";
import { System } from "modules/system/main.ts";
import * as bcrypt from "@da/bcrypt";
import { RequestKind } from "shared/enums/request.enums.ts";

export const refreshGetRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/refresh",
  kind: RequestKind.ACCOUNT,
  func: async (request: Request, url) => {
    const accountId = request.headers.get("account-id");
    let refreshToken = request.headers.get("refresh-token");

    if (!accountId || !refreshToken)
      return Response.json(
        { status: 403 },
        {
          status: 403,
        },
      );

    const accountByRefreshToken = await System.db.get([
      "accountsByRefreshToken",
      accountId,
    ]);

    if (!accountByRefreshToken)
      return Response.json(
        { status: 403 },
        {
          status: 403,
        },
      );

    const userAgent = request.headers.get("user-agent");
    const ip = getIpFromRequest(request);

    if (
      accountByRefreshToken.userAgent !== userAgent ||
      !compareIps(ip, accountByRefreshToken.ip)
    )
      return Response.json(
        { status: 403 },
        {
          status: 403,
        },
      );

    const account = await System.db.get(["accounts", accountId]);

    if (!account)
      return Response.json(
        { status: 403 },
        {
          status: 403,
        },
      );

    const result = bcrypt.compareSync(
      refreshToken,
      accountByRefreshToken.refreshTokenHash,
    );

    if (!result)
      return Response.json(
        { status: 403 },
        {
          status: 403,
        },
      );

    const token = getRandomString(64);
    refreshToken = getRandomString(128);

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

    return Response.json(
      {
        status: 200,
        data: {
          accountId: account.accountId,
          token,
          refreshToken,
          durations: [accountTokenDays, accountRefreshTokenDays],
        },
      },
      { status: 200 },
    );
  },
};
