import { RequestType } from "shared/types/main.ts";
import { RequestMethod } from "shared/enums/main.ts";
import { System } from "system/main.ts";
import * as bcrypt from "bcrypt";
import {
  PASSWORD_REGEX,
  EMAIL_REGEX,
  ACCOUNT_EXPIRE_TIME,
  USERNAME_REGEX,
} from "shared/consts/main.ts";
import { getRandomString } from "shared/utils/random.utils.ts";

export const registerRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "/register",
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
        { status: 403 },
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
        { status: 400 },
        {
          status: 400,
        },
      );

    const { value: accountByUsername } = await System.db.get([
      "accountsByUsername",
      username.toLowerCase(),
    ]);
    const { value: accountByEmail } = await System.db.get([
      "accountsByEmail",
      email,
    ]);

    if (accountByUsername || accountByEmail)
      return Response.json(
        { status: 409 },
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

    // Every key related to the account is temporary until the account is verified or freed if not
    await System.db.set(
      ["accounts", accountId],
      {
        accountId,
        username,
        email,
        passwordHash: bcrypt.hashSync(password, bcrypt.genSaltSync(8)),

        verifyId,
        verifyTokensHash: bcrypt.hashSync(verifyToken, bcrypt.genSaltSync(8)),
      },
      { expireIn: ACCOUNT_EXPIRE_TIME },
    );
    await System.db.set(["accountsByVerifyId", verifyId], accountId, {
      expireIn: ACCOUNT_EXPIRE_TIME,
    });
    await System.db.set(["accountsByEmail", email], accountId, {
      expireIn: ACCOUNT_EXPIRE_TIME,
    });
    await System.db.set(
      ["accountsByUsername", username.toLowerCase()],
      accountId,
      {
        expireIn: ACCOUNT_EXPIRE_TIME,
      },
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
