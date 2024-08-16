import { RequestType } from "shared/types/main.ts";
import { RequestMethod } from "shared/enums/main.ts";
import { System } from "system/main.ts";
import * as bcrypt from "bcrypt";

export const claimSessionRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "/claim-session",
  func: async (request, url) => {
    let { ticketId, ticketKey, sessionId, token } = await request.json();

    if (!ticketId || !ticketKey || !sessionId || !token)
      return Response.json(
        { status: 403 },
        {
          status: 403,
        },
      );

    const { value: ticket } = await System.db.get(["tickets", ticketId]);

    if (!ticket || !ticket.isUsed)
      return Response.json(
        { status: 403 },
        {
          status: 403,
        },
      );

    const ticketResult = bcrypt.compareSync(ticketKey, ticket.ticketKeyHash);
    if (!ticketResult)
      return Response.json(
        { status: 403 },
        {
          status: 403,
        },
      );

    const { value: accountBySession } = await System.db.get([
      "accountsBySession",
      sessionId,
    ]);

    if (!accountBySession)
      return Response.json(
        { status: 403 },
        {
          status: 403,
        },
      );

    const { value: account } = await System.db.get([
      "accounts",
      accountBySession,
    ]);

    if (!account)
      return Response.json(
        { status: 403 },
        {
          status: 403,
        },
      );

    const result = bcrypt.compareSync(token, account.tokenHash);

    if (!result)
      return Response.json(
        { status: 403 },
        {
          status: 403,
        },
      );

    delete account.tokenHash;

    //destroy session token (but not refresh token)
    await System.db.set(["accounts", account.accountId], account);
    await System.db.delete(["accountsBySession", sessionId]);

    //destroy ticket
    await System.db.delete(["tickets", ticketId]);

    return Response.json(
      {
        status: 200,
        data: {
          accountId: account.accountId,
          username: account.username,
        },
      },
      {
        status: 200,
      },
    );
  },
};
