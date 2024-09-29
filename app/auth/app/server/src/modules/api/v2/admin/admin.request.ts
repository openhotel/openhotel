import { RequestType } from "shared/types/request.types.ts";
import { RequestMethod } from "shared/enums/request.enum.ts";
import {
  getAccountFromRequest,
  getAccountList,
  getAdminList,
  isAccountAdminValid,
  isAccountAuthValid,
} from "shared/utils/account.utils.ts";
import { System } from "system/main.ts";

export const accountGetRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "",
  func: async (request, url) => {
    const status = await isAccountAdminValid(request);

    if (status !== 200)
      return Response.json(
        { status },
        {
          status,
        },
      );
    const adminList = (await getAdminList()).map((account) => ({
      accountId: account.accountId,
      username: account.username,
      email: account.email,
    }));

    return Response.json(
      { status: 200, data: { adminList } },
      {
        status: 200,
      },
    );
  },
};

export const accountPostRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "",
  func: async (request, url) => {
    //first time when admin account doesn't exist
    if (!(await getAdminList()).length) {
      const status = await isAccountAuthValid(request);
      if (status !== 200)
        return Response.json(
          { status },
          {
            status,
          },
        );

      const account = await getAccountFromRequest(request);

      //assign current user as admin
      await System.db.set(["accounts", account.accountId], {
        ...account,
        isAdmin: true,
      });

      return Response.json(
        {
          status: 200,
        },
        {
          status: 200,
        },
      );
    }

    const status = await isAccountAdminValid(request);

    if (status !== 200)
      return Response.json(
        { status },
        {
          status,
        },
      );
    let { email } = await request.json();

    if (!email)
      return Response.json(
        { status: 400 },
        {
          status: 400,
        },
      );

    const accountFound = (await getAccountList()).find(
      (account) => account?.email === email,
    );

    if (!accountFound)
      return Response.json(
        { status: 400, message: "Account not found!" },
        {
          status: 400,
        },
      );

    //assign current user as admin
    await System.db.set(["accounts", accountFound.accountId], {
      ...accountFound,
      isAdmin: true,
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
export const accountDeleteRequest: RequestType = {
  method: RequestMethod.DELETE,
  pathname: "",
  func: async (request, url) => {
    const status = await isAccountAdminValid(request);

    if (status !== 200)
      return Response.json(
        { status },
        {
          status,
        },
      );
    let { email } = await request.json();

    if (!email)
      return Response.json(
        { status: 400 },
        {
          status: 400,
        },
      );

    const accountFound = (await getAccountList()).find(
      (account) => account?.email === email,
    );

    if (!accountFound)
      return Response.json(
        { status: 400, message: "Account not found!" },
        {
          status: 400,
        },
      );

    delete accountFound.isAdmin;

    await System.db.set(["accounts", accountFound.accountId], accountFound);

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
