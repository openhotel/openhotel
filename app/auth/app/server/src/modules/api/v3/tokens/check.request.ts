import { RequestType, RequestMethod } from "@oh/utils";
import { RequestKind } from "shared/enums/request.enums.ts";
import { System } from "modules/system/main.ts";

export const checkGetRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/check",
  kind: RequestKind.PUBLIC,
  func: async (request, url) => {
    const appToken = request.headers.get("app-token");

    if (!appToken)
      return Response.json(
        {
          status: 400,
        },
        { status: 400 },
      );
    const valid = await System.tokens.verify(appToken);

    return Response.json(
      {
        status: 200,
        data: {
          valid,
        },
      },
      { status: 200 },
    );
  },
};
