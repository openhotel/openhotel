import {
  RequestType,
  RequestMethod,
  getResponse,
  HttpStatusCode,
  RequestKind,
} from "@oh/utils";
import { System } from "modules/system/main.ts";

export const connectionGetRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/connection",
  kind: RequestKind.TOKEN,
  func: async (request: Request, url: URL) => {
    const accountId = url.searchParams.get("accountId");
    if (!accountId) return getResponse(HttpStatusCode.FORBIDDEN);

    const account = await System.accounts.getAccount({ accountId });
    if (!account) return getResponse(HttpStatusCode.FORBIDDEN);

    const connections = await account.connections.active.getList();
    if (!connections?.length) return getResponse(HttpStatusCode.FORBIDDEN);

    return getResponse(HttpStatusCode.OK, {
      data: {
        connections: connections.map((connection) => ({
          connectionId: connection.connectionId,

          hotelId: connection.hotelId,
          scopes: connection.scopes,
        })),
      },
    });
  },
};
