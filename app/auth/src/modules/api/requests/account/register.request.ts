import { RequestType } from "shared/types/main.ts";
import { RequestMethod } from "shared/enums/main.ts";
import { System } from "system/main.ts";
import * as bcrypt from "bcrypt";

export const registerRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "/register",
  func: async (request, url) => {
    const body = await request.json();

    const accountId = crypto.randomUUID();

    const salt = await bcrypt.genSalt(8);
    const hash = await bcrypt.hash(body.password, salt);

    const account = await System.db.get(["accounts", body.username]);

    if (account?.value)
      return new Response("409", {
        status: 409,
      });

    await System.db.set(["accounts", body.username], {
      accountId,
      username: body.username,
      hash,
    });
    return Response.json(
      { accountId },
      {
        status: 200,
      },
    );
  },
};
