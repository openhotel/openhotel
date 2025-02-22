import {
  RequestType,
  RequestMethod,
  getResponse,
  HttpStatusCode,
  RequestKind,
} from "@oh/utils";
import { System } from "modules/system/main.ts";
import { EMAIL_REGEX, USERNAME_REGEX } from "shared/consts/main.ts";

export const userDeleteRequest: RequestType = {
  method: RequestMethod.DELETE,
  pathname: "/user",
  kind: RequestKind.ADMIN,
  func: async (request: Request) => {
    let { accountId } = await request.json();

    const account = await System.accounts.getAccount({ accountId });
    await account.remove();

    return getResponse(HttpStatusCode.OK);
  },
};

export const userPatchRequest: RequestType = {
  method: RequestMethod.PATCH,
  pathname: "/user",
  kind: RequestKind.ADMIN,
  func: async (request: Request) => {
    try {
      let { accountId, username, email, createdAt, admin } =
        await request.json();

      if (!accountId || !username || !email || !createdAt)
        return getResponse(HttpStatusCode.FORBIDDEN, {
          message: "Some input is missing!",
        });

      email = email.toLowerCase();

      if (
        !new RegExp(EMAIL_REGEX).test(email) ||
        !new RegExp(USERNAME_REGEX).test(username)
      )
        return getResponse(HttpStatusCode.BAD_REQUEST, {
          message: "Invalid accountId, email or username!",
        });

      const account = await System.accounts.getAccount({ accountId });

      if (!account)
        return getResponse(HttpStatusCode.BAD_REQUEST, {
          message: "AccountId is not valid!",
        });

      const accountData = account.getObject();

      if (!accountData.verified)
        return getResponse(HttpStatusCode.BAD_REQUEST, {
          message: "Account is not verified!",
        });

      const accountByUsername = await System.accounts.getAccount({ username });
      const accountByEmail = await System.accounts.getAccount({ email });

      await account.update({
        email: accountByEmail ? null : email,
        username: accountByUsername ? null : username,
        createdAt,
      });

      if ((await account.isAdmin()) !== admin) await account.setAdmin(admin);

      return getResponse(HttpStatusCode.OK);
    } catch (e) {
      return getResponse(HttpStatusCode.BAD_REQUEST);
    }
  },
};
