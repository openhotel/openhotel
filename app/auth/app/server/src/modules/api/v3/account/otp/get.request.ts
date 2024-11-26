import { RequestType, RequestMethod } from "@oh/utils";
import { System } from "modules/system/main.ts";
import { hasRequestAccess } from "shared/utils/scope.utils.ts";
import { RequestKind } from "shared/enums/request.enums.ts";

export const getRequest: RequestType = {
  method: RequestMethod.GET,
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
    if (await System.otp.isOTPVerified(account.accountId))
      return Response.json(
        {
          status: 409,
        },
        {
          status: 409,
        },
      );

    const uri = await System.otp.generateOTP(account.accountId, account.email);
    return Response.json(
      {
        status: 200,
        data: {
          uri,
        },
      },
      {
        status: 200,
      },
    );
  },
};
