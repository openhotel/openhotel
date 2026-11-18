import { System } from "system/main.ts";
import { RequestType } from "@shared/types/request.types.ts";
import { RequestMethod } from "@shared/enums/request.enums.ts";
import { getTokenData } from "@shared/utils/tokens.utils.ts";
import { getResponse } from "@shared/utils/response.utils.ts";
import { HttpStatusCode } from "@shared/enums/http-status-code.enums.ts";

export const redirectRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/redirect",
  func: () => {
    const {
      auth: { url: authUrl, appToken },
    } = System.getConfig();
    const { id } = getTokenData(appToken);

    const $url = new URL(authUrl + "/apps");
    $url.searchParams.append("appId", id);

    return getResponse(HttpStatusCode.OK, {
      data: {
        url: $url,
      },
    });
  },
};
