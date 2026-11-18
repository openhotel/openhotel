import { System } from "modules/system/main.ts";
import { RequestType } from "@shared/types/request.types.ts";
import { RequestKind, RequestMethod } from "@shared/enums/request.enums.ts";
import { getResponse } from "@shared/utils/response.utils.ts";
import { HttpStatusCode } from "@shared/enums/http-status-code.enums.ts";

export const verifyGetRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/verify",
  kind: RequestKind.ACCOUNT,
  func: async (request: Request, url: URL) => {
    const token = url.searchParams.get("token");
    if (!token) return getResponse(HttpStatusCode.BAD_REQUEST);

    const account = await System.accounts.getAccount({ request });

    if (account.getObject().restrictions)
      return getResponse(HttpStatusCode.LOCKED);

    if (await account.otp.isVerified())
      return getResponse(HttpStatusCode.CONFLICT);
    if (!(await account.otp.check(token, true)))
      return getResponse(HttpStatusCode.BAD_REQUEST);

    await account.otp.verify();

    return getResponse(HttpStatusCode.OK);
  },
};
