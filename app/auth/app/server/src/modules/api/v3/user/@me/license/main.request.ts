import { RequestType, RequestMethod } from "@oh/utils";
import { hasRequestAccess } from "shared/utils/scope.utils.ts";
import { System } from "modules/system/main.ts";
import { RequestKind } from "shared/enums/request.enums.ts";

export const mainGetRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "",
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
    const licenseToken = await System.licenses.generate(account.accountId);

    return Response.json(
      {
        status: 200,
        data: { licenseToken },
      },
      {
        status: 200,
      },
    );
  },
};
