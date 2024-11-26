import { RequestMethod, RequestType } from "@oh/utils";
import { hasRequestAccess } from "shared/utils/scope.utils.ts";
import { RequestKind } from "shared/enums/request.enums.ts";
import { System } from "modules/system/main.ts";

export const mainGetRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "",
  kind: RequestKind.CONNECTION,
  func: async (request: Request, url) => {
    if (!(await hasRequestAccess({ request, scopes: [] })))
      return Response.json(
        {
          status: 403,
        },
        { status: 403 },
      );

    const account = await System.accounts.getFromRequest(request);
    const admin = Boolean(await System.admins.get(account.accountId));

    return Response.json(
      {
        status: 200,
        data: {
          accountId: account.accountId,
          username: account.username,
          ...(admin ? { admin } : {}),
        },
      },
      { status: 200 },
    );
  },
};
