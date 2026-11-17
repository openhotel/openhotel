import { System } from "modules/system/main.ts";
import { RequestType } from "@shared/types/request.types.ts";
import { RequestKind, RequestMethod } from "@shared/enums/request.enums.ts";
import { getResponse } from "@shared/utils/response.utils.ts";
import { HttpStatusCode } from "@shared/enums/http-status-code.enums.ts";

export const verifyGetRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/verify",
  kind: RequestKind.PUBLIC,
  func: async (_request: Request, url: URL) => {
    const verifyId = url.searchParams.get("id");
    const verifyToken = url.searchParams.get("token");

    if (!verifyId || !verifyToken)
      return getResponse(HttpStatusCode.BAD_REQUEST);

    const account = await System.accounts.getAccount({
      verifyId,
      verifyToken,
    });
    if (!account) return getResponse(HttpStatusCode.BAD_REQUEST);

    await account.verify();

    return getResponse(HttpStatusCode.OK);
  },
};
