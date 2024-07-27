import { RequestType } from "shared/types/main.ts";
import { RequestMethod } from "shared/enums/main.ts";
import { System } from "system/main.ts";
import * as bcrypt from "bcrypt";
import { getRandomString } from "shared/utils/main.ts";
import {
  REFRESH_TOKEN_EXPIRE_TIME,
  SESSION_EXPIRE_TIME,
} from "shared/consts/main.ts";

export const refreshSessionRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "/refresh-session",
  func: async (request, url) => {
    let { sessionId, refreshToken } = await request.json();

    if (!sessionId || !refreshToken)
      return Response.json(
        { status: 403 },
        {
          status: 403,
        },
      );

    const { value: refreshSession } = await System.db.get([
      "refresh-session",
      sessionId,
    ]);

    if (!refreshSession)
      return Response.json(
        { status: 403 },
        {
          status: 403,
        },
      );

    const result = bcrypt.compareSync(refreshToken, refreshSession.hash);

    if (!result)
      return Response.json(
        { status: 403 },
        {
          status: 403,
        },
      );

    await System.db.delete(["session", sessionId]);
    await System.db.delete(["refresh-session", sessionId]);

    const { value: account } = await System.db.get([
      "accounts",
      refreshSession.username,
    ]);

    if (!account)
      return Response.json(
        { status: 403 },
        {
          status: 403,
        },
      );

    const token = getRandomString(64);
    const hash = bcrypt.hashSync(token, bcrypt.genSaltSync(8));

    refreshToken = getRandomString(128);
    const refreshHash = bcrypt.hashSync(refreshToken, bcrypt.genSaltSync(8));

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
        username: account.username,
      },
      { expireIn: REFRESH_TOKEN_EXPIRE_TIME },
    );

    await System.db.set(["accounts", account.username], {
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
          username: account.username,
        },
      },
      { status: 200 },
    );
  },
};
