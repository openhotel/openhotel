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

export const registerPostRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "/register",
  kind: RequestKind.PUBLIC,
  func: async (request: Request) => {
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
      return getResponse(HttpStatusCode.FORBIDDEN, {
        message: "Some input is missing or invalid captcha!",
      });

    if (languages.find((language) => !LANGUAGE_LIST.includes(language)))
      return getResponse(HttpStatusCode.BAD_REQUEST, {
        message: "Language is not valid!",
      });

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
  },
};
