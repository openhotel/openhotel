import { RequestType, RequestMethod, RequestKind } from "@oh/utils";
import { System } from "system/main.ts";

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
