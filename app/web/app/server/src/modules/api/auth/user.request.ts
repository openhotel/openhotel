import { System } from "system/main.ts";
import { RequestType } from "@shared/types/request.types.ts";
import { RequestKind, RequestMethod } from "@shared/enums/request.enums.ts";

export const userRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/user",
  kind: RequestKind.ACCOUNT,
  func: async (request: Request) => {
    const connectionToken = request.headers.get("token");

    const { accountId, username, admin, languages } = await System.auth.fetch({
      url: "/user/@me",
      connectionToken,
    });

    return Response.json(
      {
        status: 200,
        data: {
          accountId,
          username,
          admin,
          languages,
        },
      },
      {
        status: 200,
      },
    );
  },
};
