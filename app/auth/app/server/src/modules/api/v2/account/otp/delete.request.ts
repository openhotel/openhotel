import { RequestType, RequestMethod } from "@oh/utils";
import {
  getAccountFromRequest,
  isAccountAuthValid,
} from "shared/utils/account.utils.ts";
import { System } from "modules/system/main.ts";

export const deleteRequest: RequestType = {
  method: RequestMethod.DELETE,
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
    await System.db.delete(["accountOTP", account.accountId]);

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
