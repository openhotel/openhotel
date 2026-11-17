import { System } from "system/main.ts";
import { RequestType } from "@shared/types/request.types.ts";
import { RequestMethod } from "@shared/enums/request.enums.ts";
import { getResponse } from "@shared/utils/response.utils.ts";
import { HttpStatusCode } from "@shared/enums/http-status-code.enums.ts";

export const requestRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/request",
  func: (request) => {
    const config = System.getConfig();

    if (!config.auth.enabled) return getResponse(HttpStatusCode.GONE);

    const hotelId = System.auth.getHotelId();
    const integrationId = System.auth.getIntegrationId();

    const composedRedirectUrl = new URL(`${config.auth.api}/connection`);
    composedRedirectUrl.searchParams.append("state", "test");

    if (hotelId) composedRedirectUrl.searchParams.append("hotelId", hotelId);
    if (integrationId)
      composedRedirectUrl.searchParams.append("integrationId", integrationId);

    return Response.json(
      {
        status: 200,
        data: {
          redirectUrl: composedRedirectUrl.href,
        },
      },
      { status: 200 },
    );
  },
};
