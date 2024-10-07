import { RequestType, RequestMethod } from "@oh/utils";
import {
  getAccountList,
  isAccountAdminValid,
} from "shared/utils/account.utils.ts";

export const listGetRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/list",
  func: async (request, url) => {
    const status = await isAccountAdminValid(request);

    if (status !== 200)
      return Response.json(
        { status },
        {
          status,
        },
      );
    const accountList = (await getAccountList()).map((account) => ({
      accountId: account.accountId,
      username: account.username,
      email: account.email,
    }));

    return Response.json(
      { status: 200, data: { accountList } },
      {
        status: 200,
      },
    );
  },
};
