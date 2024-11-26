import { RequestType, RequestMethod } from "@oh/utils";
import { System } from "modules/system/main.ts";
import { hasRequestAccess } from "shared/utils/scope.utils.ts";
import { RequestKind } from "shared/enums/request.enums.ts";

export const verifyGetRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/verify",
  kind: RequestKind.ACCOUNT,
  func: async (request, url) => {
    if (!(await hasRequestAccess({ request })))
      return Response.json(
        { status: 403 },
        {
          status: 403,
        },
      );

    const token = url.searchParams.get("token");
    if (!token)
      return Response.json(
        { status: 400 },
        {
          status: 400,
        },
      );

    const account = await System.accounts.getFromRequest(request);

    const accountOTP = await System.db.get([
      "otpByAccountId",
      account.accountId,
    ]);
    if (!accountOTP)
      return Response.json(
        {
          status: 404,
        },
        {
          status: 404,
        },
      );

    if (accountOTP.verified)
      return Response.json(
        {
          status: 409,
        },
        {
          status: 409,
        },
      );

    const isValid = System.otp.verify(accountOTP.secret, token);

    if (!isValid)
      return Response.json(
        {
          status: 403,
        },
        {
          status: 403,
        },
      );

    await System.db.set(["otpByAccountId", account.accountId], {
      ...accountOTP,
      verified: true,
    });

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
