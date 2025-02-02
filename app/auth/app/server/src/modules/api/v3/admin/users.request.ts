import {
  RequestType,
  RequestMethod,
  getResponse,
  HttpStatusCode,
} from "@oh/utils";
import { RequestKind } from "shared/enums/request.enums.ts";
import { System } from "modules/system/main.ts";

export const usersGetRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/users",
  kind: RequestKind.ADMIN,
  func: async (request: Request, url: URL) => {
    const username = url.searchParams.get("username");
    const accountId = url.searchParams.get("accountId");
    if (accountId || username)
      return getResponse(HttpStatusCode.OK, {
        data: {
          user: System.accounts.getAccount({ accountId, username }),
        },
      });

    const users = (
      await Promise.all(
        (await System.accounts.getAccountList()).map(($account) =>
          $account.getPublicObject(),
        ),
      )
    ).sort((userA: any, userB: any) =>
      userA.createdAt > userB.createdAt ? -1 : 1,
    );

    return getResponse(HttpStatusCode.OK, {
      data: { users },
    });
  },
};
