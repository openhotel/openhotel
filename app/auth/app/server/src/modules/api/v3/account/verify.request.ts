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
  kind: RequestKind.PUBLIC,
  func: async (_request: Request, url: URL) => {
    const verifyId = url.searchParams.get("id");
    const verifyToken = url.searchParams.get("token");

    if (!verifyId || !verifyToken) return getResponse(HttpStatusCode.FORBIDDEN);

    const account = await System.accounts.getAccount({
      verifyId,
      verifyToken,
    });
    if (!account) return getResponse(HttpStatusCode.FORBIDDEN);

    await account.verify();

    return getResponse(HttpStatusCode.OK);
  },
};
