import { RequestType } from "shared/types/request.types.ts";
import { RequestMethod } from "shared/enums/request.enum.ts";
import {
  getAccountFromRequest,
  isAccountAuthValid,
} from "shared/utils/account.utils.ts";
import { System } from "modules/system/main.ts";

export const verifyRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/verify",
  func: async (request, url) => {
    const token = url.searchParams.get("token");
    if (!token)
      return Response.json(
        { status: 400 },
        {
          status: 400,
        },
      );

    const status = await isAccountAuthValid(request);

    if (status !== 200)
      return Response.json(
        { status },
        {
          status,
        },
      );

    const account = await getAccountFromRequest(request);

    const accountOTP = await System.db.get(["accountOTP", account.accountId]);
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

    await System.db.set(["accountOTP", account.accountId], {
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
