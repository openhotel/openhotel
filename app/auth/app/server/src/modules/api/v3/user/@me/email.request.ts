import { RequestMethod, RequestType } from "@oh/utils";
import { hasRequestAccess } from "shared/utils/scope.utils.ts";
import { RequestKind } from "shared/enums/request.enums.ts";
import { System } from "modules/system/main.ts";

export const emailGetRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/email",
  kind: RequestKind.ACCOUNT,
  func: async (request: Request, url) => {
    if (!(await hasRequestAccess({ request })))
      return Response.json(
        {
          status: 403,
        },
        { status: 403 },
      );

    const account = await System.accounts.getFromRequest(request);

    return Response.json(
      {
        status: 200,
        data: {
          email: account.email,
        },
      },
      { status: 200 },
    );
  },
};
