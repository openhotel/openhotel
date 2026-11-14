import {
  RequestType,
  RequestMethod,
  getResponse,
  HttpStatusCode,
  RequestKind,
} from "@oh/utils";
import { System } from "modules/system/main.ts";

export const userResendVerificationRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "/user/resendVerification",
  kind: RequestKind.ADMIN,
  func: async (request: Request, url: URL) => {
    const { accountId } = await request.json();

    const account = await System.accounts.getAccount({ accountId });
    if (!account) return getResponse(HttpStatusCode.FORBIDDEN);

    const accountData = account.getObject();
    if (accountData.verified) return getResponse(HttpStatusCode.FORBIDDEN);

    await account.sendVerificationEmail();
    return getResponse(HttpStatusCode.OK);
  },
};
