import {
  RequestType,
  RequestMethod,
  getResponse,
  HttpStatusCode,
  getRandomString,
} from "@oh/utils";
import * as bcrypt from "@da/bcrypt";
import { RequestKind } from "shared/enums/request.enums.ts";
import { System } from "modules/system/main.ts";
import { getEmailByHash } from "shared/utils/account.utils.ts";
import { hasRequestAccess } from "shared/utils/scope.utils.ts";

export const userResendVerificationRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "/user/resendVerification",
  kind: RequestKind.ADMIN,
  func: async (request: Request, url: URL) => {
    if (!(await hasRequestAccess({ request, admin: true })))
      return getResponse(HttpStatusCode.FORBIDDEN);

    const { accountId } = await request.json();

    const account = await System.accounts.get(accountId);
    if (!account) return getResponse(HttpStatusCode.FORBIDDEN);
    if (account.verified) return getResponse(HttpStatusCode.FORBIDDEN);

    const email = await getEmailByHash(account.emailHash);

    const verifyId = getRandomString(16);
    const verifyToken = getRandomString(32);

    const { url: apiUrl } = System.getConfig();

    const verifyUrl = `${apiUrl}/verify?id=${verifyId}&token=${verifyToken}`;
    System.email.send(
      email,
      "verify your account",
      verifyUrl,
      `<a href="${verifyUrl}">${verifyUrl}<p/>`,
    );

    const {
      email: { enabled: isEmailVerificationEnabled },
      times: { accountWithoutVerificationDays },
    } = System.getConfig();
    const expireIn = accountWithoutVerificationDays * 24 * 60 * 60 * 1000;

    await System.db.set(
      ["accounts", accountId],
      { ...account, createdAt: Date.now() },
      isEmailVerificationEnabled ? { expireIn } : {},
    );
    await System.db.set(
      ["accountsByVerifyId", verifyId],
      {
        accountId,
        verifyTokensHash: isEmailVerificationEnabled
          ? bcrypt.hashSync(verifyToken, bcrypt.genSaltSync(8))
          : null,
      },
      {
        expireIn,
      },
    );
    await System.db.set(
      ["accountsByEmail", account.emailHash],
      accountId,
      isEmailVerificationEnabled
        ? {
            expireIn,
          }
        : {},
    );
    await System.db.set(
      ["accountsByUsername", account.username.toLowerCase()],
      accountId,
      isEmailVerificationEnabled
        ? {
            expireIn,
          }
        : {},
    );

    return getResponse(HttpStatusCode.OK);
  },
};
