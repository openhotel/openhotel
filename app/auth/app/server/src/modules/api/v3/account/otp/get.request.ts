import { System } from "modules/system/main.ts";
import { RequestType } from "@shared/types/request.types.ts";
import { RequestKind, RequestMethod } from "@shared/enums/request.enums.ts";
import { getResponse } from "@shared/utils/response.utils.ts";
import { HttpStatusCode } from "@shared/enums/http-status-code.enums.ts";

export const getRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "",
  kind: RequestKind.ACCOUNT,
  func: async (request: Request) => {
    const account = await System.accounts.getAccount({ request });

    if (account.getObject().restrictions)
      return getResponse(HttpStatusCode.LOCKED);

    if (await account.otp.isVerified())
      return getResponse(HttpStatusCode.CONFLICT);

    return getResponse(HttpStatusCode.OK, {
      data: { uri: await account.otp.create() },
    });
  },
};
