import {
  RequestType,
  RequestMethod,
  getResponse,
  HttpStatusCode,
} from "@oh/utils";
import { System } from "modules/system/main.ts";
import { PASSWORD_REGEX } from "shared/consts/main.ts";
import { RequestKind } from "shared/enums/request.enums.ts";
import { getPasswordMaxLength } from "shared/utils/password.utils.ts";

export const changePasswordPostRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "/change-password",
  kind: RequestKind.PUBLIC,
  func: async (request: Request) => {
    const { password, rePassword, token } = await request.json();

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

    const account = await System.accounts.getAccount({
      recoverToken: token,
    });
    if (!account) {
      return getResponse(HttpStatusCode.BAD_REQUEST, {
        message: "Recover password request has expired, please send a new one",
      });
    }

    await account.update({
      password,
    });

    return getResponse(HttpStatusCode.OK);
  },
};
