import {
  RequestType,
  RequestMethod,
  getResponse,
  HttpStatusCode,
} from "@oh/utils";
import { RequestKind } from "shared/enums/request.enums.ts";
import { System } from "modules/system/main.ts";
import { hasAppTokenAccess } from "shared/utils/tokens.utils.ts";

export const connectionGetRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/connection",
  kind: RequestKind.TOKEN,
  func: async (request: Request, url: URL) => {
    if (!(await hasAppTokenAccess(request)))
      return getResponse(HttpStatusCode.FORBIDDEN);

    const accountId = url.searchParams.get("accountId");
    // const hotelId = url.searchParams.get("hotelId");

    if (!accountId) return getResponse(HttpStatusCode.FORBIDDEN);

    const account = await System.accounts.get(accountId);
    // const hotel = await System.hotels.get(hotelId);

    if (!account) return getResponse(HttpStatusCode.FORBIDDEN);

    const connection =
      await System.connections.getConnectionByAccount(accountId);

    if (!connection) return getResponse(HttpStatusCode.FORBIDDEN);

    return getResponse(HttpStatusCode.OK, {
      data: {
        connection: {
          connectionId: connection.connectionId,

          hotelId: connection.hotelId,
          scopes: connection.scopes,
        },
      },
    });
  },
};
