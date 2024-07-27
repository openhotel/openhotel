import { RequestType } from "shared/types/main.ts";
import { RequestMethod } from "shared/enums/main.ts";
import { System } from "system/main.ts";
import * as bcrypt from "bcrypt";
import { getRandomString } from "shared/utils/main.ts";
import {
  REFRESH_TOKEN_EXPIRE_TIME,
  SESSION_EXPIRE_TIME,
} from "shared/consts/main.ts";

export const loginRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "/login",
  func: async (request, url) => {
    const { username, password, captchaId } = await request.json();

    if (!(await System.captcha.verify(captchaId)) || !username || !password)
      return Response.json(
        { status: 403 },
        {
          status: 403,
        },
      );

    const { value: account } = await System.db.get(["accounts", username]);

    if (!account)
      return Response.json(
        { status: 403 },
        {
          status: 403,
        },
      );

    const result = bcrypt.compareSync(password, account.hash);

    if (!result)
      return Response.json(
        { status: 403 },
        {
          status: 403,
        },
      );

    const sessionId = getRandomString(16);

    const token = getRandomString(64);
    const hash = bcrypt.hashSync(token, bcrypt.genSaltSync(8));

    const refreshToken = getRandomString(128);
    const refreshHash = bcrypt.hashSync(refreshToken, bcrypt.genSaltSync(8));

    if (account.sessionId) {
      await System.db.delete(["session", account.sessionId]);
      await System.db.delete(["refresh-session", account.sessionId]);
    }

    await System.db.set(
      ["session", sessionId],
      {
        hash,
        accountId: account.accountId,
      },
      { expireIn: SESSION_EXPIRE_TIME },
    );
    await System.db.set(
      ["refresh-session", sessionId],
      {
        hash: refreshHash,
        accountId: account.accountId,
        username,
      },
      { expireIn: REFRESH_TOKEN_EXPIRE_TIME },
    );

    await System.db.set(["accounts", username], {
      ...account,
      sessionId,
    });

    return Response.json(
      {
        status: 200,
        data: {
          sessionId,
          token,
          refreshToken,
          username,
        },
      },
      { status: 200 },
    );
  },
};
