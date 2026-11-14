import {
  RequestMethod,
  RequestType,
  getResponse,
  HttpStatusCode,
  RequestKind,
} from "@oh/utils";
import { System } from "modules/system/main.ts";

export const appsGetRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/apps",
  kind: RequestKind.ACCOUNT,
  func: async (request: Request, url: URL) => {
    const appId = url.searchParams.get("appId");
    if (!appId) return getResponse(HttpStatusCode.BAD_REQUEST);

    const account = await System.accounts.getAccount({ request });
    if (!account) return getResponse(HttpStatusCode.BAD_REQUEST);

    const appUrl = await account.addApp(appId);
    if (!appUrl) return getResponse(HttpStatusCode.BAD_REQUEST);

    return getResponse(HttpStatusCode.OK, {
      data: {
        url: appUrl,
      },
    });
  },
};
