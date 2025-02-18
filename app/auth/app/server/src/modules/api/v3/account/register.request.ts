import {
  RequestType,
  RequestMethod,
  getResponse,
  HttpStatusCode,
} from "@oh/utils";
import { System } from "modules/system/main.ts";
import {
  PASSWORD_REGEX,
  EMAIL_REGEX,
  USERNAME_REGEX,
  LANGUAGE_LIST,
} from "shared/consts/main.ts";
import { RequestKind } from "shared/enums/request.enums.ts";
import { getPasswordMaxLength } from "shared/utils/password.utils.ts";

export const registerPostRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "/register",
  kind: RequestKind.PUBLIC,
  func: async (request: Request) => {
    try {
      let { email, username, password, rePassword, languages, captchaId } =
        await request.json();

      if (
        !(await System.captcha.verify(captchaId)) ||
        !email ||
        !username ||
        !password ||
        !languages?.length ||
        !rePassword
      )
        return getResponse(HttpStatusCode.BAD_REQUEST, {
          message: "Some input is missing or invalid captcha!",
        });

      if (languages.find((language) => !LANGUAGE_LIST.includes(language)))
        return getResponse(HttpStatusCode.BAD_REQUEST, {
          message: "Language is not valid!",
        });

      const maxLength = await getPasswordMaxLength();

      if (password.length > maxLength) {
        return getResponse(HttpStatusCode.BAD_REQUEST, {
          message: `Password length cannot be more than ${maxLength} characters!`,
        });
      }

      if (
        !new RegExp(EMAIL_REGEX).test(email) ||
        !new RegExp(USERNAME_REGEX).test(username) ||
        !new RegExp(PASSWORD_REGEX).test(password) ||
        password !== rePassword
      )
        return getResponse(HttpStatusCode.BAD_REQUEST, {
          message: "Invalid email, username or password!",
        });

      const accountByUsername = await System.accounts.getAccount({ username });
      const accountByEmail = await System.accounts.getAccount({ email });

      if (accountByUsername || accountByEmail)
        return getResponse(HttpStatusCode.CONFLICT, {
          message: "Username or email already in use!",
        });

      await System.accounts.create({
        email,
        username,
        languages,
        password,
      });

      return getResponse(HttpStatusCode.OK);
    } catch (e) {
      return getResponse(HttpStatusCode.INTERNAL_SERVER_ERROR);
    }
  },
};
