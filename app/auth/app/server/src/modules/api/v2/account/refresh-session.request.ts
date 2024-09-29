import { RequestType } from "shared/types/main.ts";
import { RequestMethod } from "shared/enums/main.ts";
import { System } from "system/main.ts";
import * as bcrypt from "bcrypt";
import {
  SESSION_EXPIRE_TIME,
  REFRESH_TOKEN_EXPIRE_TIME,
  SESSION_WITHOUT_TICKET_EXPIRE_TIME,
  SERVER_SESSION_EXPIRE_TIME,
} from "shared/consts/main.ts";
import { getRandomString } from "shared/utils/random.utils.ts";
import { getRedirectUrl } from "shared/utils/account.utils.ts";
import { getIpFromRequest } from "shared/utils/ip.utils.ts";

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

    let ticket;
    if (ticketId) {
      const { value: foundTicket } = await System.db.get(["tickets", ticketId]);

      ticket = foundTicket;
      if (!foundTicket || foundTicket.isUsed)
        return Response.json(
          { status: 410 },
          {
            status: 410,
          },
        );
    }

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
      expireIn: ticket
        ? SESSION_EXPIRE_TIME
        : SESSION_WITHOUT_TICKET_EXPIRE_TIME,
    });
    await System.db.set(
      ["accountsByRefreshSession", sessionId],
      account.accountId,
      { expireIn: REFRESH_TOKEN_EXPIRE_TIME },
    );
    if (ticket) {
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
      await System.db.set(["ticketBySession", sessionId], ticket.ticketId, {
        expireIn: SESSION_EXPIRE_TIME,
      });

      //server session
      const ip = getIpFromRequest(request);
      await System.db.set(
        ["serverSessionByAccount", account.accountId],
        {
          sessionId,
          ticketId,
          server: ticket.redirectUrl,
          ip,
        },
        {
          //first time 5 minutes, next, 60 seconds
          expireIn: SERVER_SESSION_EXPIRE_TIME * 5,
        },
      );
    }

    return Response.json(
      {
        status: 200,
        data: {
          redirectUrl: ticket
            ? getRedirectUrl({
                redirectUrl: ticket.redirectUrl,
                ticketId: ticket.ticketId,
                sessionId: account.sessionId,
                token,
                accountId: account.accountId,
              })
            : null,

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
