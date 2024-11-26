import { RequestType, RequestMethod } from "@oh/utils";
import { System } from "modules/system/main.ts";
import { RequestKind } from "shared/enums/request.enums.ts";
import { hasRequestAccess } from "shared/utils/scope.utils.ts";

export const pingGetRequest: RequestType = {
  method: RequestMethod.PATCH,
  pathname: "/ping",
  kind: RequestKind.ACCOUNT,
  func: async (request, url) => {
    if (!(await hasRequestAccess({ request })))
      return Response.json(
        { status: 403 },
        {
          status: 403,
        },
      );

    const account = await System.accounts.getFromRequest(request);
    const connectionId = url.searchParams.get("connectionId");

    const pingResult = await System.connections.ping(
      account.accountId,
      connectionId,
    );
    if (!pingResult)
      return Response.json(
        { status: 403 },
        {
          status: 403,
        },
      );

    return Response.json(
      {
        status: 200,
        data: {
          estimatedNextPingIn: pingResult.estimatedNextPingIn,
        },
      },
      { status: 200 },
    );
  },
};
