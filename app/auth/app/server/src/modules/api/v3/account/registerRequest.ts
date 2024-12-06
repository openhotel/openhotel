import { RequestType, RequestMethod, getRandomString } from "@oh/utils";
import { System } from "modules/system/main.ts";
import * as bcrypt from "@da/bcrypt";
import {
  PASSWORD_REGEX,
  EMAIL_REGEX,
  USERNAME_REGEX,
} from "shared/consts/main.ts";
import { RequestKind } from "shared/enums/request.enums.ts";

export const registerPostRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "/register",
  kind: RequestKind.PUBLIC,
  func: async (request, url) => {
    const { email, username, password, rePassword, captchaId } =
      await request.json();

    if (
      !(await System.captcha.verify(captchaId)) ||
      !email ||
      !username ||
      !password ||
      !rePassword
    )
      return Response.json(
        { status: 403, message: "Some input is missing or invalid captcha!" },
        {
          status: 403,
        },
      );

    if (
      !new RegExp(EMAIL_REGEX).test(email) ||
      !new RegExp(USERNAME_REGEX).test(username) ||
      !new RegExp(PASSWORD_REGEX).test(password) ||
      password !== rePassword
    )
      return Response.json(
        { status: 400, message: "Invalid email, username or password!" },
        {
          status: 400,
        },
      );

    const accountByUsername = await System.db.get([
      "accountsByUsername",
      username.toLowerCase(),
    ]);
    const accountByEmail = await System.db.get(["accountsByEmail", email]);

    if (accountByUsername || accountByEmail)
      return Response.json(
        { status: 409, message: "Username or email already in use!" },
        {
          status: 409,
        },
      );

    const accountId = crypto.randomUUID();

    const verifyId = getRandomString(16);
    const verifyToken = getRandomString(32);

    const { url: apiUrl } = System.getConfig();

    const verifyUrl = `${apiUrl}/verify?id=${verifyId}&token=${verifyToken}`;
    System.email.send(
      email,
      "verify your account",
      verifyUrl,
      `<a href="${verifyUrl}">${verifyUrl}<p/>`,
    );

    const {
      email: { enabled: isEmailVerificationEnabled },
      times: { accountWithoutVerificationDays },
    } = System.getConfig();
    const expireIn = accountWithoutVerificationDays * 24 * 60 * 60 * 1000;

    // Every key related to the account is temporary until the account is verified or freed if not
    await System.db.set(
      ["accounts", accountId],
      {
        accountId,
        username,
        email,
        passwordHash: bcrypt.hashSync(password, bcrypt.genSaltSync(8)),
        createdAt: Date.now(),
        verified: !isEmailVerificationEnabled,
      },
      isEmailVerificationEnabled ? { expireIn } : {},
    );
    await System.db.set(
      ["accountsByVerifyId", verifyId],
      {
        accountId,
        verifyTokensHash: isEmailVerificationEnabled
          ? bcrypt.hashSync(verifyToken, bcrypt.genSaltSync(8))
          : null,
      },
      {
        expireIn,
      },
    );
    await System.db.set(
      ["accountsByEmail", email],
      accountId,
      isEmailVerificationEnabled
        ? {
            expireIn,
          }
        : {},
    );
    await System.db.set(
      ["accountsByUsername", username.toLowerCase()],
      accountId,
      isEmailVerificationEnabled
        ? {
            expireIn,
          }
        : {},
    );

    return Response.json(
      {
        status: 200,
      },
      {
        status: 200,
      },
    );
  },
};
