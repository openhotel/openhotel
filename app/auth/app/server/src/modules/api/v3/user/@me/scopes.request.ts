import {
  RequestMethod,
  RequestType,
  getResponse,
  HttpStatusCode,
  RequestKind,
} from "@oh/utils";
import { System } from "modules/system/main.ts";

export const scopesGetRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/scopes",
  kind: RequestKind.CONNECTION,
  func: async (request: Request) => {
    const account = await System.accounts.getAccount({ request });
    if (!account) return getResponse(HttpStatusCode.FORBIDDEN);

    const connection = await account.connections.active.get();
    if (!connection) return getResponse(HttpStatusCode.FORBIDDEN);

    return getResponse(HttpStatusCode.OK, {
      data: {
        scopes: connection.scopes,
      },
    });
  },
};
