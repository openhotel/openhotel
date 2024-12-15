import {
  RequestType,
  RequestMethod,
  getResponse,
  HttpStatusCode,
  getIpFromRequest,
} from "@oh/utils";
import { System } from "modules/system/main.ts";
import { RequestKind } from "shared/enums/request.enums.ts";

export const pingGetRequest: RequestType = {
  method: RequestMethod.PATCH,
  pathname: "/ping",
  kind: RequestKind.CONNECTION,
  func: async (request: Request, url: URL) => {
    const connectionId = url.searchParams.get("connectionId");
    if (!connectionId) return getResponse(HttpStatusCode.FORBIDDEN);

    const userAgent = request.headers.get("user-agent");
    const ip = getIpFromRequest(request);

    try {
      const connection =
        await System.connections.getConnectionByConnection(connectionId);

      if (
        !connection ||
        connection.connectionId !== connectionId ||
        connection.userAgent !== userAgent ||
        connection.ip !== ip
      )
        return getResponse(HttpStatusCode.FORBIDDEN);

      const pingResult = await System.connections.ping(connection);

      return getResponse(HttpStatusCode.OK, {
        data: {
          estimatedNextPingIn: pingResult.estimatedNextPingIn,
        },
      });
    } catch (e) {
      return getResponse(HttpStatusCode.FORBIDDEN);
    }
  },
};
