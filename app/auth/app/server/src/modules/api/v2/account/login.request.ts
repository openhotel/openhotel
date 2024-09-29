import { RequestType } from "shared/types/main.ts";
import { RequestMethod } from "shared/enums/main.ts";
import { System } from "system/main.ts";
import * as bcrypt from "bcrypt";
import { getIpFromRequest, getRandomString } from "shared/utils/main.ts";
import {
  REFRESH_TOKEN_EXPIRE_TIME,
  SESSION_EXPIRE_TIME,
  SESSION_WITHOUT_TICKET_EXPIRE_TIME,
} from "shared/consts/main.ts";

export const loginRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "/login",
  func: async (request, url) => {
    const { ticketId, email, password, captchaId, otpToken } =
      await request.json();

    if (!email || !password)
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

    console.log(account.username, ">> ip >>", getIpFromRequest(request));

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

    const { value: accountOTP } = await System.db.get([
      "accountOTP",
      account.accountId,
    ]);

    let isValidOTP = true;

    if (
      accountOTP?.verified &&
      (!otpToken || !System.otp.verify(accountOTP.secret, otpToken))
    )
      isValidOTP = false;

    if (!(await System.captcha.verify(captchaId)))
      return Response.json(
        { status: isValidOTP ? 451 : 461, message: "Captcha is not valid!" },
        {
          status: isValidOTP ? 451 : 461,
        },
      );

    if (!isValidOTP)
      return Response.json(
        { status: 441, message: "OTP is not valid!" },
        {
          status: 441,
        },
      );

    if (account.sessionId) {
      await System.db.delete(["accountsBySession", account.sessionId]);
      await System.db.delete(["accountsByRefreshSession", account.sessionId]);
      await System.db.delete(["ticketBySession", account.sessionId]);
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
    }

    return Response.json(
      {
        status: 200,
        data: {
          redirectUrl: ticket
            ? `${ticket.redirectUrl}?ticketId=${ticket.ticketId}&sessionId=${sessionId}&token=${token}`
            : null,

          sessionId,
          token,
          refreshToken,
        },
      },
      { status: 200 },
    );
  },
};
