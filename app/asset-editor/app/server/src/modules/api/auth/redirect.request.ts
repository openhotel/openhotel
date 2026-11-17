import { System } from "system/main.ts";
import { RequestType } from "@shared/types/request.types.ts";
import { RequestMethod } from "@shared/enums/request.enums.ts";
import { getTokenData } from "@shared/utils/tokens.utils.ts";

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
