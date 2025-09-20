import { RequestType, RequestMethod } from "@oh/utils";
import { System } from "system/main.ts";
import { getTokenData } from "@oh/utils";

export const redirectRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/redirect",
  func: (request) => {
    const {
      auth: { url: authUrl, appToken },
    } = System.getConfig();
    const { id } = getTokenData(appToken);

    const $url = new URL(authUrl + "/apps");
    $url.searchParams.append("appId", id);
    return Response.json(
      {
        status: 200,
        data: {
          url: $url,
        },
      },
      { status: 200 },
    );
  },
};
