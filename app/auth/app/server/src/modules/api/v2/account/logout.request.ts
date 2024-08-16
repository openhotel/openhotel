import { RequestType } from "shared/types/main.ts";
import { RequestMethod } from "shared/enums/main.ts";
import { System } from "system/main.ts";
import * as bcrypt from "bcrypt";

export const logoutRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "/logout",
  func: async (request, url) => {
    let { sessionId, refreshToken } = await request.json();

    if (!sessionId || !refreshToken)
      return Response.json(
        { status: 403 },
        {
          status: 403,
        },
      );

    const { value: accountByRefreshSession } = await System.db.get([
      "accountsByRefreshSession",
      sessionId,
    ]);

    if (!accountByRefreshSession)
      return Response.json(
        { status: 403 },
        {
          status: 403,
        },
      );

    const { value: account } = await System.db.get([
      "accounts",
      accountByRefreshSession,
    ]);

    if (!account)
      return Response.json(
        { status: 403 },
        {
          status: 403,
        },
      );

    const result = bcrypt.compareSync(refreshToken, account.refreshTokenHash);

    if (!result)
      return Response.json(
        { status: 403 },
        {
          status: 403,
        },
      );

    delete account.sessionId;
    delete account.tokenHash;
    delete account.refreshTokenHash;

    await System.db.set(["accounts", account.accountId], account);
    await System.db.delete(["accountsBySession", sessionId]);
    await System.db.delete(["accountsByRefreshSession", sessionId]);

    return Response.json(
      {
        status: 200,
      },
      {
        status: 200,
      },
    );
  },
};
