import { System } from "modules/system/main.ts";
import { RequestType } from "@shared/types/request.types.ts";
import { RequestKind, RequestMethod } from "@shared/enums/request.enums.ts";
import { getResponse } from "@shared/utils/response.utils.ts";
import { HttpStatusCode } from "@shared/enums/http-status-code.enums.ts";

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
      captchaData,
    } = await request.json();

    if (!email || !password)
      return getResponse(HttpStatusCode.BAD_REQUEST, {
        message: "Email or password not valid!",
      });

    const account = await System.accounts.getAccount({ email });

    if (!account || account.getObject().blocked)
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

    const captchaResponse = await System.captcha.verify(captchaData);
    if (!captchaResponse)
      return getResponse(HttpStatusCode.BAD_REQUEST, {
        message: "Something went wrong, try again!",
      });

    if (!isValidOTP)
      return Response.json(
        { status: 441, message: "2FA is missing!" },
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
