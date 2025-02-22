import { RequestType, RequestMethod, RequestKind } from "@oh/utils";
import { System } from "system/main.ts";

export const userRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/user",
  kind: RequestKind.ACCOUNT,
  func: async (request: Request) => {
    const accountId = request.headers.get("account-id");
    const accountToken = request.headers.get("account-token");

    const {
      auth: { url: authUrl, appToken },
    } = System.getConfig();

    const data = await fetch(`${authUrl}/api/v3/user/@me`, {
      headers: {
        "app-token": appToken,
        "account-id": accountId,
        "account-token": accountToken,
      },
    }).then((response) => response.json());

    return Response.json(data, {
      status: data.status,
    });
  },
};
