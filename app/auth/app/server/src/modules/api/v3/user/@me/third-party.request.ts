import {
  RequestMethod,
  RequestType,
  getResponse,
  HttpStatusCode,
} from "@oh/utils";
import { RequestKind } from "shared/enums/request.enums.ts";
import { System } from "modules/system/main.ts";

export const thirdPartyGetRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/third-party",
  kind: RequestKind.ACCOUNT,
  func: async (request: Request, url: URL) => {
    const appId = url.searchParams.get("appId");
    if (!appId) return getResponse(HttpStatusCode.FORBIDDEN);

    const account = await System.accounts.getAccount({ request });
    if (!account) return getResponse(HttpStatusCode.FORBIDDEN);

    const thirdPartyUrl = await account.addThirdPartyApp(appId);
    if (!thirdPartyUrl) return getResponse(HttpStatusCode.FORBIDDEN);

    return getResponse(HttpStatusCode.OK, {
      data: {
        url: thirdPartyUrl,
      },
    });
  },
};
