import {
  RequestType,
  RequestMethod,
  getResponse,
  HttpStatusCode,
} from "@oh/utils";
import { hasRequestAccess } from "shared/utils/scope.utils.ts";
import { RequestKind } from "shared/enums/request.enums.ts";
import { System } from "modules/system/main.ts";
import { getEmailByHash } from "shared/utils/account.utils.ts";

export const usersGetRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/users",
  kind: RequestKind.ADMIN,
  func: async (request: Request, url: URL) => {
    if (!(await hasRequestAccess({ request })))
      return getResponse(HttpStatusCode.FORBIDDEN);

    const users = (
      await Promise.all(
        (await System.accounts.getList()).map(async (account) => ({
          accountId: account.accountId,
          username: account.username,
          email: await getEmailByHash(account.emailHash),
          admin: Boolean(await System.admins.get(account.accountId)),
          otp: await System.otp.isOTPVerified(account.accountId),
          createdAt: account.createdAt,
          verified: account.verified,
        })),
      )
    ).sort((userA: any, userB: any) =>
      userA.createdAt > userB.createdAt ? -1 : 1,
    );

    const username = url.searchParams.get("username");
    if (username)
      return getResponse(HttpStatusCode.OK, {
        data: {
          user: users.find((account) => account.username === username),
        },
      });

    const accountId = url.searchParams.get("accountId");
    if (accountId)
      return getResponse(HttpStatusCode.OK, {
        data: {
          user: users.find((account) => account.accountId === accountId),
        },
      });

    return getResponse(HttpStatusCode.OK, {
      data: { users },
    });
  },
};
