import {
  RequestType,
  RequestMethod,
  getResponse,
  HttpStatusCode,
} from "@oh/utils";
import { System } from "modules/system/main.ts";
import { hasRequestAccess } from "shared/utils/scope.utils.ts";
import { RequestKind } from "shared/enums/request.enums.ts";

export const getRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "",
  kind: RequestKind.ACCOUNT,
  func: async (request: Request) => {
    if (!(await hasRequestAccess({ request })))
      return getResponse(HttpStatusCode.FORBIDDEN);

    const account = await System.accounts.getFromRequest(request);
    if (await System.otp.isOTPVerified(account.accountId))
      return getResponse(HttpStatusCode.CONFLICT);

    const uri = await System.otp.generateOTP(account.accountId, account.email);

    return getResponse(HttpStatusCode.OK, { data: { uri } });
  },
};
