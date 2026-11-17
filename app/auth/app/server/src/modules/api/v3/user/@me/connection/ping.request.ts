import { System } from "modules/system/main.ts";
import { RequestType } from "@shared/types/request.types.ts";
import { RequestKind, RequestMethod } from "@shared/enums/request.enums.ts";
import { getResponse } from "@shared/utils/response.utils.ts";
import { HttpStatusCode } from "@shared/enums/http-status-code.enums.ts";

export const pingGetRequest: RequestType = {
  method: RequestMethod.PATCH,
  pathname: "/ping",
  kind: RequestKind.PUBLIC,
  func: async (request: Request, url: URL) => {
    const connectionId = url.searchParams.get("connectionId");
    if (!connectionId) return getResponse(HttpStatusCode.FORBIDDEN);

    const account = await System.accounts.getAccount({
      connectionId,
    });
    if (!account) return getResponse(HttpStatusCode.FORBIDDEN);

    if (account.getObject().restrictions)
      return getResponse(HttpStatusCode.LOCKED);

    const pingResult = await account.connections.active.ping(
      connectionId,
      request,
    );
    if (!pingResult) return getResponse(HttpStatusCode.FORBIDDEN);

    return getResponse(HttpStatusCode.OK, {
      data: {
        estimatedNextPingIn: pingResult.estimatedNextPingIn,
      },
    });
  },
};
