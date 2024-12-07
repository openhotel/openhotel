import {
  RequestType,
  RequestMethod,
  getResponse,
  HttpStatusCode,
} from "@oh/utils";
import { System } from "modules/system/main.ts";
import { RequestKind } from "shared/enums/request.enums.ts";
import { hasRequestAccess } from "shared/utils/scope.utils.ts";

export const pingGetRequest: RequestType = {
  method: RequestMethod.PATCH,
  pathname: "/ping",
  kind: RequestKind.ACCOUNT,
  func: async (request: Request, url: URL) => {
    if (!(await hasRequestAccess({ request })))
      return getResponse(HttpStatusCode.FORBIDDEN);

    const account = await System.accounts.getFromRequest(request);
    const connectionId = url.searchParams.get("connectionId");

    const pingResult = await System.connections.ping(
      account.accountId,
      connectionId,
    );
    if (!pingResult) return getResponse(HttpStatusCode.FORBIDDEN);

    return getResponse(HttpStatusCode.OK, {
      data: {
        estimatedNextPingIn: pingResult.estimatedNextPingIn,
      },
    });
  },
};
