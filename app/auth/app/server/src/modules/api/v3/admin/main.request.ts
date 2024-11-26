import { RequestType, RequestMethod } from "@oh/utils";
import { RequestKind } from "shared/enums/request.enums.ts";
import { System } from "modules/system/main.ts";
import { hasRequestAccess } from "shared/utils/scope.utils.ts";

export const adminPostRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "",
  kind: RequestKind.ADMIN,
  func: async (request: Request, url) => {
    if (!(await hasRequestAccess({ request })))
      return Response.json(
        {
          status: 403,
        },
        { status: 403 },
      );

    const adminList = await System.admins.getList();

    //if no admins, first to call the request, is admin
    if (!adminList.length) {
      const account = await System.accounts.getFromRequest(request);
      await System.admins.set(account.accountId);

      return Response.json(
        {
          status: 200,
        },
        { status: 200 },
      );
    }

    if (!(await hasRequestAccess({ request, admin: true })))
      return Response.json(
        {
          status: 403,
        },
        { status: 403 },
      );

    const accountId = url.searchParams.get("accountId");
    if (
      !accountId ||
      !(await System.accounts.get(accountId)) ||
      (await System.admins.get(accountId))
    )
      return Response.json(
        {
          status: 400,
        },
        { status: 400 },
      );

    await System.admins.set(accountId);

    return Response.json(
      {
        status: 200,
      },
      { status: 200 },
    );
  },
};

export const adminDeleteRequest: RequestType = {
  method: RequestMethod.DELETE,
  pathname: "",
  kind: RequestKind.ADMIN,
  func: async (request: Request, url) => {
    if (!(await hasRequestAccess({ request, admin: true })))
      return Response.json(
        {
          status: 403,
        },
        { status: 403 },
      );

    const accountId = url.searchParams.get("accountId");
    if (!accountId || !(await System.admins.get(accountId)))
      return Response.json(
        {
          status: 400,
        },
        { status: 400 },
      );

    await System.admins.remove(accountId);

    return Response.json(
      {
        status: 200,
      },
      { status: 200 },
    );
  },
};
