import { RequestType } from "shared/types/main.ts";
import { RequestMethod } from "shared/enums/main.ts";
import { System } from "system/main.ts";
import * as bcrypt from "bcrypt";

export const registerRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "/register",
  func: async (request, url) => {
    const { username, password } = await request.json();

    if (!username || !password)
      return Response.json(
        { status: 403 },
        {
          status: 403,
        },
      );

    const accountId = crypto.randomUUID();

    const salt = await bcrypt.genSalt(8);
    const hash = await bcrypt.hash(password, salt);

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
