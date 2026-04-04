import {
  RequestType,
  RequestMethod,
  getResponse,
  HttpStatusCode,
  RequestKind,
} from "@oh/utils";
import { System } from "modules/system/main.ts";
import { PASSWORD_REGEX } from "shared/consts/main.ts";
import { getPasswordMaxLength } from "shared/utils/password.utils.ts";

export const changePasswordPostRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "/change-password",
  kind: RequestKind.PUBLIC,
  func: async (request: Request) => {
    const { password, rePassword, token, captchaData } = await request.json();

    if (!password || !rePassword || !token) {
      return getResponse(HttpStatusCode.BAD_REQUEST, {
        message: "Some input is missing",
      });
    }

    const maxLength = await getPasswordMaxLength();

    if (password.length > maxLength) {
      return getResponse(HttpStatusCode.BAD_REQUEST, {
        message: `Password length cannot be more than ${maxLength} characters!`,
      });
    }

    if (!new RegExp(PASSWORD_REGEX).test(password) || password !== rePassword) {
      return getResponse(HttpStatusCode.BAD_REQUEST, {
        message: "Invalid password",
      });
    }

    const captchaResponse = await System.captcha.verify(captchaData);
    if (!captchaResponse)
      return getResponse(HttpStatusCode.BAD_REQUEST, {
        message: "Something went wrong, try again!",
      });

    const account = await System.accounts.getAccount({
      recoverToken: token,
    });
    if (!account) {
      return getResponse(HttpStatusCode.BAD_REQUEST, {
        message: "Recover password request has expired, please send a new one",
      });
    }

    if (account.getObject().restrictions)
      return getResponse(HttpStatusCode.LOCKED);

    await account.update({
      password,
    });

    return getResponse(HttpStatusCode.OK);
  },
};
