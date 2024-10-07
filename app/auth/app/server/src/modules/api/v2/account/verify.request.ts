import { RequestType } from "shared/types/main.ts";
import { RequestMethod } from "shared/enums/main.ts";
import { System } from "modules/system/main.ts";
import * as bcrypt from "bcrypt";

export const verifyRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/verify",
  func: async (request, url) => {
    const id = url.searchParams.get("id");
    const token = url.searchParams.get("token");

    if (!id || !token)
      return Response.json(
        { status: 403 },
        {
          status: 403,
        },
      );

    const accountByVerifyId = await System.db.get(["accountsByVerifyId", id]);

    if (!accountByVerifyId)
      return Response.json(
        { status: 403 },
        {
          status: 403,
        },
      );

    const account = await System.db.get(["accounts", accountByVerifyId]);
    if (!account || !account.verifyId || !account.verifyTokensHash)
      return Response.json(
        { status: 403 },
        {
          status: 403,
        },
      );

    const result = bcrypt.compareSync(token, account.verifyTokensHash);

    if (!result)
      return Response.json(
        { status: 403 },
        {
          status: 403,
        },
      );

    delete account.verifyId;
    delete account.verifyTokensHash;

    await System.db.delete(["accountsByVerifyId", id]);

    await System.db.set(["accounts", account.accountId], account);
    await System.db.set(["accountsByEmail", account.email], account.accountId);
    await System.db.set(
      ["accountsByUsername", account.username.toLowerCase()],
      account.accountId,
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
