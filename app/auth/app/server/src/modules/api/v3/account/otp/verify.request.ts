import {
  RequestType,
  RequestMethod,
  getResponse,
  HttpStatusCode,
} from "@oh/utils";
import { System } from "modules/system/main.ts";
import { hasRequestAccess } from "shared/utils/scope.utils.ts";
import { RequestKind } from "shared/enums/request.enums.ts";

export const verifyGetRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/verify",
  kind: RequestKind.ACCOUNT,
  func: async (request: Request, url: URL) => {
    if (!(await hasRequestAccess({ request })))
      return getResponse(HttpStatusCode.FORBIDDEN);

    const token = url.searchParams.get("token");
    if (!token) return getResponse(HttpStatusCode.BAD_REQUEST);

    const account = await System.accounts.getFromRequest(request);

    const accountOTP = await System.db.get([
      "otpByAccountId",
      account.accountId,
    ]);
    if (!accountOTP) return getResponse(HttpStatusCode.NOT_FOUND);
    if (accountOTP.verified) return getResponse(HttpStatusCode.CONFLICT);

    const isValid = System.otp.verify(accountOTP.secret, token);
    if (!isValid) return getResponse(HttpStatusCode.FORBIDDEN);

    await System.db.set(["otpByAccountId", account.accountId], {
      ...accountOTP,
      verified: true,
    });

    return getResponse(HttpStatusCode.OK);
  },
};
