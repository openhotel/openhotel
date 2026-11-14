import {
  RequestType,
  RequestMethod,
  getResponse,
  HttpStatusCode,
  RequestKind,
} from "@oh/utils";
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

    const accounts = await System.accounts.getAccountList();

    const users = (
      await Promise.allSettled(
        accounts.map((account) => account.getPublicObject()),
      )
    )
      .filter((result) => result.status === "fulfilled")
      .map((result) => result.value)
      .sort((userA: any, userB: any) =>
        userA.createdAt > userB.createdAt ? -1 : 1,
      );

    return getResponse(HttpStatusCode.OK, {
      data: { users },
    });
  },
};
