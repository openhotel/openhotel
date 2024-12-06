import {
  RequestType,
  RequestMethod,
  getRandomString,
  getIpFromRequest,
} from "@oh/utils";
import { System } from "modules/system/main.ts";
import * as bcrypt from "@da/bcrypt";
import { RequestKind } from "shared/enums/request.enums.ts";

export const loginPostRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "/login",
  kind: RequestKind.PUBLIC,
  func: async (request: Request, url) => {
    const {
      email,
      password,
      otpToken,
      //
      captchaId,
    } = await request.json();

    if (!email || !password)
      return Response.json(
        { status: 403, message: "Email or password not valid!" },
        {
          status: 403,
        },
      );

    const accountByEmail = await System.db.get(["accountsByEmail", email]);

    if (!accountByEmail)
      return Response.json(
        { status: 403, message: "Email or password not valid!" },
        {
          status: 403,
        },
      );
    const account = await System.db.get(["accounts", accountByEmail]);
    if (!account)
      return Response.json(
        { status: 403, message: "Contact an administrator!" },
        {
          status: 403,
        },
      );

    if (!account.verified)
      return Response.json(
        { status: 403, message: "Your email is not verified!" },
        {
          status: 403,
        },
      );

    const result = bcrypt.compareSync(password, account.passwordHash);

    if (!result)
      return Response.json(
        { status: 403, message: "Email or password not valid!" },
        {
          status: 403,
        },
      );

    const accountByVerifyId = await System.db.get([
      "accountsByVerifyId",
      account.accountId,
    ]);
    if (accountByVerifyId)
      return Response.json(
        { status: 403, message: "Account is not verified!" },
        {
          status: 403,
        },
      );

    const accountOTP = await System.db.get([
      "otpByAccountId",
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

    const token = getRandomString(64);
    const refreshToken = getRandomString(128);

    const userAgent = request.headers.get("user-agent");
    const ip = getIpFromRequest(request);

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
