import { RequestType, RequestMethod } from "@oh/utils";
import { System } from "modules/system/main.ts";
import { hasRequestAccess } from "shared/utils/scope.utils.ts";
import { RequestKind } from "shared/enums/request.enums.ts";

export const deleteRequest: RequestType = {
  method: RequestMethod.DELETE,
  pathname: "",
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
    await System.db.delete(["otpByAccountId", account.accountId]);

    return Response.json(
      {
        status: 200,
      },
      {
        status: 200,
      },
    );
  },
};
