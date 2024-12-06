import { RequestType, RequestMethod } from "@oh/utils";
import { System } from "modules/system/main.ts";
import * as bcrypt from "@da/bcrypt";
import { RequestKind } from "shared/enums/request.enums.ts";

export const verifyGetRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/verify",
  kind: RequestKind.PUBLIC,
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

    const account = await System.db.get([
      "accounts",
      accountByVerifyId.accountId,
    ]);
    if (!account)
      return Response.json(
        { status: 403 },
        {
          status: 403,
        },
      );

    const result = bcrypt.compareSync(
      token,
      accountByVerifyId.verifyTokensHash,
    );

    if (!result)
      return Response.json(
        { status: 403 },
        {
          status: 403,
        },
      );

    await System.db.delete(["accountsByVerifyId", id]);

    await System.db.set(["accounts", account.accountId], {
      ...account,
      verified: true,
    });
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
