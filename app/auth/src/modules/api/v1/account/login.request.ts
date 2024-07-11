import { RequestType } from "shared/types/main.ts";
import { RequestMethod } from "shared/enums/main.ts";
import { System } from "system/main.ts";
import * as bcrypt from "bcrypt";
import { getRandomString } from "shared/utils/main.ts";

export const loginRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "/login",
  func: async (request, url) => {
    const { username, password } = await request.json();

    if (!username || !password)
      return Response.json(
        { status: 403 },
        {
          status: 403,
        },
      );

    const { value: account } = await System.db.get(["accounts", username]);

    console.log(account);
    if (!account)
      return Response.json(
        { status: 403 },
        {
          status: 403,
        },
      );

    const result = await bcrypt.compare(password, account.hash);

    if (!result)
      return Response.json(
        { status: 403 },
        {
          status: 403,
        },
      );

    const sessionId = getRandomString(16);
    const token = getRandomString(64);

    const salt = await bcrypt.genSalt(8);
    const hash = await bcrypt.hash(token, salt);

    await System.db.set(["session", sessionId], {
      hash,
      accountId: account.accountId,
      expireIn: 1000 * 60 * 5,
    });

    return Response.json(
      {
        status: 200,
        data: {
          sessionId,
          token,
          username,
        },
      },
      { status: 200 },
    );
  },
};
