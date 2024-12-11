import {
  RequestType,
  RequestMethod,
  getRandomString,
  getIpFromRequest,
  getResponse,
  HttpStatusCode,
} from "@oh/utils";
import { System } from "modules/system/main.ts";
import * as bcrypt from "@da/bcrypt";
import { RequestKind } from "shared/enums/request.enums.ts";
import { pepperPassword } from "shared/utils/pepper.utils.ts";

export const loginPostRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "/login",
  kind: RequestKind.PUBLIC,
  func: async (request: Request) => {
    const {
      email,
      password,
      otpToken,
      //
      captchaId,
    } = await request.json();

    if (!email || !password)
      return getResponse(HttpStatusCode.FORBIDDEN, {
        message: "Email or password not valid!",
      });

    const accountByEmail = await System.db.get(["accountsByEmail", email]);

    if (!accountByEmail)
      return getResponse(HttpStatusCode.FORBIDDEN, {
        message: "Email or password not valid!",
      });

    const account = await System.db.get(["accounts", accountByEmail]);
    if (!account)
      return getResponse(HttpStatusCode.FORBIDDEN, {
        message: "Contact an administrator!",
      });

    if (!account.verified)
      return getResponse(HttpStatusCode.FORBIDDEN, {
        message: "Your email is not verified!",
      });

    if (!account.passwordHash)
      return getResponse(HttpStatusCode.FORBIDDEN, {
        message: "Email or password not valid!",
      });

    const result = bcrypt.compareSync(
      await pepperPassword(password),
      account.passwordHash,
    );

    if (!result)
      return getResponse(HttpStatusCode.FORBIDDEN, {
        message: "Email or password not valid!",
      });

    const accountByVerifyId = await System.db.get([
      "accountsByVerifyId",
      account.accountId,
    ]);
    if (accountByVerifyId)
      return getResponse(HttpStatusCode.FORBIDDEN, {
        message: "Account is not verified!",
      });

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

    const token = getRandomString(54);
    const refreshToken = getRandomString(64);

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
