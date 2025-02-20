import { System } from "system/main.ts";
import { RequestType, RequestMethod } from "@oh/utils";

export const userRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/user",
  func: async (request, url) => {
    const accountId = url.searchParams.get("accountId");
    const accountToken = url.searchParams.get("accountToken");
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

    return Response.json(data, { status: data.status });
  },
};
