import {
  RequestType,
  RequestMethod,
  getResponse,
  HttpStatusCode,
} from "@oh/utils";
import { hasRequestAccess } from "shared/utils/scope.utils.ts";
import { RequestKind } from "shared/enums/request.enums.ts";
import { System } from "modules/system/main.ts";
import { EMAIL_REGEX, USERNAME_REGEX } from "shared/consts/main.ts";
import { getEmailHash, getEncryptedEmail } from "shared/utils/account.utils.ts";

export const userDeleteRequest: RequestType = {
  method: RequestMethod.DELETE,
  pathname: "/user",
  kind: RequestKind.ADMIN,
  func: async (request: Request) => {
    if (!(await hasRequestAccess({ request, admin: true })))
      return getResponse(HttpStatusCode.FORBIDDEN);

    let { accountId } = await request.json();
    await System.accounts.remove(accountId);

    return getResponse(HttpStatusCode.OK);
  },
};

export const userPatchRequest: RequestType = {
  method: RequestMethod.PATCH,
  pathname: "/user",
  kind: RequestKind.ADMIN,
  func: async (request: Request) => {
    if (!(await hasRequestAccess({ request, admin: true })))
      return getResponse(HttpStatusCode.FORBIDDEN);

    let { accountId, username, email, createdAt, admin } = await request.json();

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

    const account = await System.db.get(["accounts", accountId]);

    if (!account)
      return getResponse(HttpStatusCode.BAD_REQUEST, {
        message: "AccountId is not valid!",
      });

    if (!account.verified)
      return getResponse(HttpStatusCode.BAD_REQUEST, {
        message: "Account is not verified!",
      });

    const accountByUsername =
      account.username !== username
        ? await System.db.get(["accountsByUsername", username.toLowerCase()])
        : false;
    const emailHash = await getEmailHash(email);
    const accountByEmail =
      account.emailHash !== emailHash
        ? await System.db.get(["accountsByEmail", emailHash])
        : false;

    if (accountByUsername || accountByEmail)
      return getResponse(HttpStatusCode.CONFLICT, {
        message: "Username or email already in use!",
      });

    //update email hash
    await System.db.delete(["accountsByEmail", account.emailHash]);
    await System.db.set(["accountsByEmail", emailHash], accountId);

    //update encrypted email
    const encryptedEmail = await getEncryptedEmail(email);
    await System.db.delete(["emailsByHash", account.emailHash]);
    await System.db.set(["emailsByHash", emailHash], encryptedEmail);

    //update username
    await System.db.delete([
      "accountsByUsername",
      account.username.toLowerCase(),
    ]);
    await System.db.set(["accountsByUsername", username.toLowerCase()]);

    await System.db.set(["accounts", accountId], {
      ...account,
      accountId,
      username,
      emailHash,
      createdAt,
    });

    await (admin
      ? System.admins.set(accountId)
      : System.admins.remove(accountId));

    return getResponse(HttpStatusCode.OK);
  },
};
