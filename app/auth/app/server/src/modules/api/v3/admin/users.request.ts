import { RequestType, RequestMethod } from "@oh/utils";
import { hasRequestAccess } from "shared/utils/scope.utils.ts";
import { RequestKind } from "shared/enums/request.enums.ts";
import { System } from "modules/system/main.ts";

export const usersGetRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/users",
  kind: RequestKind.ADMIN,
  func: async (request, url) => {
    if (!(await hasRequestAccess({ request })))
      return Response.json(
        {
          status: 403,
        },
        { status: 403 },
      );

    const users = await Promise.all(
      (await System.accounts.getList()).map(async (account) => ({
        accountId: account.accountId,
        username: account.username,
        email: account.email,
        admin: Boolean(await System.admins.get(account.accountId)),
        otp: await System.otp.isOTPVerified(account.accountId),
      })),
    );

    const username = url.searchParams.get("username");
    if (username)
      return Response.json(
        {
          status: 200,
          data: {
            user: users.find((account) => account.username === username),
          },
        },
        {
          status: 200,
        },
      );

    const accountId = url.searchParams.get("accountId");
    if (accountId)
      return Response.json(
        {
          status: 200,
          data: {
            user: users.find((account) => account.accountId === accountId),
          },
        },
        {
          status: 200,
        },
      );

    return Response.json(
      { status: 200, data: { users } },
      {
        status: 200,
      },
    );
  },
};
