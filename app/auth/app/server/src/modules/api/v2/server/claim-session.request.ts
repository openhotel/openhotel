import {
  RequestType,
  RequestMethod,
  getIpFromRequest,
  getRandomString,
} from "@oh/utils";
import { System } from "modules/system/main.ts";
import * as bcrypt from "bcrypt";
import { SERVER_SESSION_EXPIRE_TIME } from "shared/consts/session.consts.ts";

export const claimSessionRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "/claim-session",
  func: async (request, url) => {
    if (!(await System.servers.isRequestValid(request)))
      return Response.json(
        { status: 403 },
        {
          status: 403,
        },
      );

    let { ticketId, ticketKey, sessionId, token } = await request.json();

    if (!ticketId || !ticketKey || !sessionId || !token)
      return Response.json(
        { status: 403 },
        {
          status: 403,
        },
      );

    const ticket = await System.db.get(["tickets", ticketId]);

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

    const accountBySession = await System.db.get([
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

    const account = await System.db.get(["accounts", accountBySession]);

    if (!account)
      return Response.json(
        { status: 403 },
        {
          status: 403,
        },
      );

    const serverSession = await System.db.get([
      "serverSessionByAccount",
      account.accountId,
    ]);

    if (!serverSession)
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
    await System.db.delete(["ticketBySession", sessionId]);

    //destroy ticket
    await System.db.delete(["tickets", ticketId]);

    const serverSessionToken = getRandomString(64);

    //save current server ip to verify identity on future petitions
    const serverIp = getIpFromRequest(request);
    await System.db.set(
      ["serverSessionByAccount", account.accountId],
      {
        ...serverSession,
        serverIp,
        serverToken: bcrypt.hashSync(serverSessionToken, bcrypt.genSaltSync(8)),
        claimed: true,
      },
      {
        expireIn: SERVER_SESSION_EXPIRE_TIME,
      },
    );
    await System.sessions.checkAccountSession(account.accountId);

    return Response.json(
      {
        status: 200,
        data: {
          accountId: account.accountId,
          username: account.username,
          token: serverSessionToken,
        },
      },
      {
        status: 200,
      },
    );
  },
};
