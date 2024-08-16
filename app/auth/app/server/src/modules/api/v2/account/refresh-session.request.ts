import { RequestType } from "shared/types/main.ts";
import { RequestMethod } from "shared/enums/main.ts";
import { System } from "system/main.ts";
import * as bcrypt from "bcrypt";
import {
  SESSION_EXPIRE_TIME,
  REFRESH_TOKEN_EXPIRE_TIME,
} from "shared/consts/main.ts";
import { getRandomString } from "shared/utils/random.utils.ts";

export const refreshSessionRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "/refresh-session",
  func: async (request, url) => {
    let { ticketId, sessionId, refreshToken } = await request.json();

    if (!sessionId || !refreshToken)
      return Response.json(
        { status: 403 },
        {
          status: 403,
        },
      );

    //Allow to redirect to retrieve a new ticket
    if (!ticketId)
      return Response.json(
        { status: 410 },
        {
          status: 410,
        },
      );
    const { value: ticket } = await System.db.get(["tickets", ticketId]);

    if (!ticket || ticket.isUsed)
      return Response.json(
        { status: 410 },
        {
          status: 410,
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

    const token = getRandomString(64);
    refreshToken = getRandomString(128);

    await System.db.set(["accounts", account.accountId], {
      ...account,
      sessionId,
      tokenHash: bcrypt.hashSync(token, bcrypt.genSaltSync(8)),
      refreshTokenHash: bcrypt.hashSync(refreshToken, bcrypt.genSaltSync(8)),
    });
    await System.db.set(["accountsBySession", sessionId], account.accountId, {
      expireIn: SESSION_EXPIRE_TIME,
    });
    await System.db.set(
      ["accountsByRefreshSession", sessionId],
      account.accountId,
      { expireIn: REFRESH_TOKEN_EXPIRE_TIME },
    );
    await System.db.set(
      ["tickets", ticket.ticketId],
      {
        ...ticket,
        isUsed: true,
      },
      {
        expireIn: SESSION_EXPIRE_TIME,
      },
    );

    return Response.json(
      {
        status: 200,
        data: {
          redirectUrl: `${ticket.redirectUrl}?ticketId=${ticket.ticketId}&sessionId=${account.sessionId}&token=${token}`,

          token,
          refreshToken,
        },
      },
      {
        status: 200,
      },
    );
  },
};
