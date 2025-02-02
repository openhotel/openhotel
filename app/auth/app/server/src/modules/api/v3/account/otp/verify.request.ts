import {
  RequestType,
  RequestMethod,
  getResponse,
  HttpStatusCode,
} from "@oh/utils";
import { System } from "modules/system/main.ts";
import { RequestKind } from "shared/enums/request.enums.ts";

export const verifyGetRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/verify",
  kind: RequestKind.ACCOUNT,
  func: async (request: Request, url: URL) => {
    const token = url.searchParams.get("token");
    if (!token) return getResponse(HttpStatusCode.BAD_REQUEST);

    const account = await System.accounts.getAccount({ request });

    if (await account.otp.isVerified())
      return getResponse(HttpStatusCode.CONFLICT);
    if (!(await account.otp.check(token, true)))
      return getResponse(HttpStatusCode.FORBIDDEN);

    await account.otp.verify();

    return getResponse(HttpStatusCode.OK);
  },
};
