import { System } from "modules/system/main.ts";
import { RequestType } from "@shared/types/request.types.ts";
import { RequestKind, RequestMethod } from "@shared/enums/request.enums.ts";
import { getResponse } from "@shared/utils/response.utils.ts";
import { HttpStatusCode } from "@shared/enums/http-status-code.enums.ts";

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
