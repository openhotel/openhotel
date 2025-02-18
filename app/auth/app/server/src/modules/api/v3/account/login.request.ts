import {
  RequestType,
  RequestMethod,
  getResponse,
  HttpStatusCode,
} from "@oh/utils";
import { System } from "modules/system/main.ts";
import { RequestKind } from "shared/enums/request.enums.ts";

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
      return getResponse(HttpStatusCode.BAD_REQUEST, {
        message: "Email or password not valid!",
      });

    const account = await System.accounts.getAccount({ email });

    if (!account)
      return getResponse(HttpStatusCode.BAD_REQUEST, {
        message: "Email or password not valid!",
      });

    const accountData = account.getObject();

    if (!accountData.verified)
      return getResponse(HttpStatusCode.BAD_REQUEST, {
        message: "Your email is not verified!",
      });

    if (!accountData.passwordHash)
      return getResponse(HttpStatusCode.BAD_REQUEST, {
        message: "Email or password not valid!",
      });

    if (!(await account.checkPassword(password)))
      return getResponse(HttpStatusCode.BAD_REQUEST, {
        message: "Email or password not valid!",
      });

    const isValidOTP = await account.otp.check(otpToken);

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

    const tokensData = await account.createTokens(request);

    return getResponse(HttpStatusCode.OK, {
      data: {
        accountId: accountData.accountId,
        token: tokensData.token,
        refreshToken: tokensData.refreshToken,
        durations: tokensData.durations,
      },
    });
  },
};
