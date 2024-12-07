import {
  RequestMethod,
  RequestType,
  getResponse,
  HttpStatusCode,
} from "@oh/utils";
import { hasRequestAccess } from "shared/utils/scope.utils.ts";
import { RequestKind } from "shared/enums/request.enums.ts";
import { System } from "modules/system/main.ts";

export const scopesGetRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/scopes",
  kind: RequestKind.CONNECTION,
  func: async (request: Request) => {
    if (!(await hasRequestAccess({ request, scopes: [] })))
      return getResponse(HttpStatusCode.FORBIDDEN);

    const connectionToken = request.headers.get("connection-token");

    if (!connectionToken)
      return getResponse(HttpStatusCode.OK, { data: { scopes: ["*"] } });

    const connection = await System.connections.get(connectionToken);

    if (!connection) return getResponse(HttpStatusCode.FORBIDDEN);

    return getResponse(HttpStatusCode.OK, {
      data: {
        scopes: connection.scopes,
      },
    });
  },
};
