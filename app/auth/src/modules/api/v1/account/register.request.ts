import { RequestType } from "shared/types/main.ts";
import { RequestMethod } from "shared/enums/main.ts";
import { System } from "system/main.ts";
import * as bcrypt from "bcrypt";
import {PASSWORD_REGEX, USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH} from "shared/consts/main.ts";

export const registerRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "/register",
  func: async (request, url) => {
    const { username, password, captchaId } = await request.json();

    if (!(await System.captcha.verify(captchaId)) || !username || !password)
      return Response.json(
        { status: 403 },
        {
          status: 403,
        },
      );

    if (username.length > USERNAME_MAX_LENGTH || username.length < USERNAME_MIN_LENGTH)
      return Response.json(
        { status: 400 },
        {
          status: 400,
        },
      );

    if (!password.test(PASSWORD_REGEX))
      return Response.json(
        { status: 400 },
        {
          status: 400,
        },
      );

    const accountId = crypto.randomUUID();

    const salt = bcrypt.genSaltSync(8);
    const hash = bcrypt.hashSync(password, salt);

    const { value: account } = await System.db.get(["accounts", username]);

    if (account)
      return Response.json(
        { status: 409 },
        {
          status: 409,
        },
      );

    await System.db.set(["accounts", username], {
      accountId,
      username,
      hash,
    });
    return Response.json(
      {
        status: 200,
        data: {
          accountId,
        },
      },
      {
        status: 200,
      },
    );
  },
};
