import { RequestType } from "shared/types/request.types.ts";
import { RequestMethod } from "shared/enums/request.enum.ts";
import {
  getAccountFromRequest,
  isAccountAuthValid,
} from "shared/utils/account.utils.ts";

export const accountGetRequest: RequestType = {
  method: RequestMethod.GET,
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

    return Response.json(
      {
        status: 200,
        data: {
          username: account.username,
          email: account.email,
        },
      },
      {
        status: 200,
      },
    );
  },
};
