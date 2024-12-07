import {
  RequestType,
  RequestMethod,
  getResponse,
  HttpStatusCode,
} from "@oh/utils";
import { RequestKind } from "shared/enums/request.enums.ts";
import { System } from "modules/system/main.ts";
import { hasRequestAccess } from "shared/utils/scope.utils.ts";

export const adminPostRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "",
  kind: RequestKind.ADMIN,
  func: async (request: Request, url: URL) => {
    if (!(await hasRequestAccess({ request })))
      return getResponse(HttpStatusCode.FORBIDDEN);

    const adminList = await System.admins.getList();

    //if no admins, first to call the request, is admin
    if (!adminList.length) {
      const account = await System.accounts.getFromRequest(request);
      await System.admins.set(account.accountId);

      return getResponse(HttpStatusCode.OK);
    }

    if (!(await hasRequestAccess({ request, admin: true })))
      return getResponse(HttpStatusCode.FORBIDDEN);

    const accountId = url.searchParams.get("accountId");
    if (
      !accountId ||
      !(await System.accounts.get(accountId)) ||
      (await System.admins.get(accountId))
    )
      return getResponse(HttpStatusCode.BAD_REQUEST);

    await System.admins.set(accountId);

    return getResponse(HttpStatusCode.OK);
  },
};

export const adminDeleteRequest: RequestType = {
  method: RequestMethod.DELETE,
  pathname: "",
  kind: RequestKind.ADMIN,
  func: async (request: Request, url: URL) => {
    if (!(await hasRequestAccess({ request, admin: true })))
      return getResponse(HttpStatusCode.FORBIDDEN);

    const accountId = url.searchParams.get("accountId");
    if (!accountId || !(await System.admins.get(accountId)))
      return getResponse(HttpStatusCode.BAD_REQUEST);

    await System.admins.remove(accountId);

    return getResponse(HttpStatusCode.OK);
  },
};
