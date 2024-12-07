import {
  RequestMethod,
  RequestType,
  getResponse,
  HttpStatusCode,
} from "@oh/utils";
import { hasRequestAccess } from "shared/utils/scope.utils.ts";
import { RequestKind } from "shared/enums/request.enums.ts";
import { System } from "modules/system/main.ts";

export const mainGetRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "",
  kind: RequestKind.CONNECTION,
  func: async (request: Request) => {
    if (!(await hasRequestAccess({ request, scopes: [] })))
      return getResponse(HttpStatusCode.FORBIDDEN);

    const account = await System.accounts.getFromRequest(request);
    const admin = Boolean(await System.admins.get(account.accountId));

    return getResponse(HttpStatusCode.OK, {
      data: {
        accountId: account.accountId,
        username: account.username,
        ...(admin ? { admin } : {}),
      },
    });
  },
};
