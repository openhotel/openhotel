import { RequestType, RequestMethod } from "@oh/utils";
import {
  getAccountFromRequest,
  isAccountAuthValid,
} from "shared/utils/account.utils.ts";
import { System } from "modules/system/main.ts";

export const postRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "",
  func: async (request, url) => {
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

    if (accountOTP?.verified)
      return Response.json(
        {
          status: 409,
        },
        {
          status: 409,
        },
      );

    const secret = System.otp.generateSecret();
    const uri = System.otp.generateURI(account.email, secret);

    await System.db.set(["accountOTP", account.accountId], {
      secret,
      verified: false,
    });

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
