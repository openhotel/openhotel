import { RequestType, RequestMethod } from "@oh/utils";
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

    let data: any = {
      username: account.username,
      email: account.email,
    };
    if (account.isAdmin) data.isAdmin = true;

    return Response.json(
      {
        status: 200,
        data,
      },
      {
        status: 200,
      },
    );
  },
};
