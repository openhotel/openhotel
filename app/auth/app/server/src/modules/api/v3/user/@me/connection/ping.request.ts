import {
  RequestType,
  RequestMethod,
  getResponse,
  HttpStatusCode,
} from "@oh/utils";
import { System } from "modules/system/main.ts";
import { RequestKind } from "shared/enums/request.enums.ts";

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

    const pingResult = await account.connections.ping(connectionId, request);
    if (!pingResult) return getResponse(HttpStatusCode.FORBIDDEN);

    return getResponse(HttpStatusCode.OK, {
      data: {
        estimatedNextPingIn: pingResult.estimatedNextPingIn,
      },
    });
  },
};
