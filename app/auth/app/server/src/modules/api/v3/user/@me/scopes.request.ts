import {
  RequestMethod,
  RequestType,
  getResponse,
  HttpStatusCode,
} from "@oh/utils";
import { RequestKind } from "shared/enums/request.enums.ts";
import { System } from "modules/system/main.ts";

export const scopesGetRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/scopes",
  kind: RequestKind.CONNECTION,
  func: async (request: Request) => {
    const account = await System.accounts.getAccount({ request });
    if (!account) return getResponse(HttpStatusCode.FORBIDDEN);

    const connection = await account.connections.getActiveConnection();
    if (!connection) return getResponse(HttpStatusCode.FORBIDDEN);

    return getResponse(HttpStatusCode.OK, {
      data: {
        scopes: connection.scopes,
      },
    });
  },
};
