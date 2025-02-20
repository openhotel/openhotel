import { System } from "system/main.ts";
import {
  getTokenData,
  RequestType,
  RequestMethod,
  getResponse,
  HttpStatusCode,
} from "@oh/utils";

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
