import { RequestType } from "shared/types/main.ts";
import { RequestMethod } from "shared/enums/main.ts";
import { System } from "system/main.ts";
import * as bcrypt from "bcrypt";
import { getRandomString } from "shared/utils/main.ts";
import {
  REFRESH_TOKEN_EXPIRE_TIME,
  SESSION_EXPIRE_TIME,
} from "shared/consts/main.ts";

export const loginRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "/login",
  func: async (request, url) => {
    const { ticketId, email, password, captchaId } = await request.json();

    if (
      !(await System.captcha.verify(captchaId)) ||
      !email ||
      !password ||
      !ticketId
    )
      return Response.json(
        { status: 403 },
        {
          status: 403,
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

    const { value: accountByEmail } = await System.db.get([
      "accountsByEmail",
      email,
    ]);

    if (!accountByEmail)
      return Response.json(
        { status: 403 },
        {
          status: 403,
        },
      );
    const { value: account } = await System.db.get([
      "accounts",
      accountByEmail,
    ]);
    if (!account)
      return Response.json(
        { status: 403 },
        {
          status: 403,
        },
      );

    const result = bcrypt.compareSync(password, account.passwordHash);

    if (!result)
      return Response.json(
        { status: 403 },
        {
          status: 403,
        },
      );

    if (account.verifyId)
      return Response.json(
        { status: 403, message: "Account is not verified!" },
        {
          status: 403,
        },
      );

    if (account.sessionId) {
      await System.db.delete(["accountsBySession", account.sessionId]);
      await System.db.delete(["accountsByRefreshSession", account.sessionId]);
    }

    const sessionId = crypto.randomUUID();
    const token = getRandomString(64);
    const refreshToken = getRandomString(128);

    await System.db.set(["accounts", account.accountId], {
      ...account,
      sessionId,
      updatedAt: Date.now(),
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
          redirectUrl: `${ticket.redirectUrl}?ticketId=${ticket.ticketId}&sessionId=${sessionId}&token=${token}`,

          sessionId,
          token,
          refreshToken,
        },
      },
      { status: 200 },
    );
  },
};
