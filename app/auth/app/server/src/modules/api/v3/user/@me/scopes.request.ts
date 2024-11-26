import { RequestMethod, RequestType } from "@oh/utils";
import { hasRequestAccess } from "shared/utils/scope.utils.ts";
import { RequestKind } from "shared/enums/request.enums.ts";
import { System } from "modules/system/main.ts";

export const scopesGetRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/scopes",
  kind: RequestKind.CONNECTION,
  func: async (request: Request, url) => {
    if (!(await hasRequestAccess({ request, scopes: [] })))
      return Response.json(
        {
          status: 403,
        },
        { status: 403 },
      );
    const connectionToken = request.headers.get("connection-token");

    if (!connectionToken)
      return Response.json(
        {
          status: 200,
          data: {
            scopes: ["*"],
          },
        },
        { status: 200 },
      );

    const connection = await System.connections.get(connectionToken);

    if (!connection)
      return Response.json(
        {
          status: 403,
        },
        { status: 403 },
      );

    return Response.json(
      {
        status: 200,
        data: {
          scopes: connection.scopes,
        },
      },
      { status: 200 },
    );
  },
};
