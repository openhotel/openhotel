import { System } from "modules/system/main.ts";
import { RequestType } from "@shared/types/request.types.ts";
import { RequestKind, RequestMethod } from "@shared/enums/request.enums.ts";
import { getResponse } from "@shared/utils/response.utils.ts";
import { HttpStatusCode } from "@shared/enums/http-status-code.enums.ts";

export const licenseGetRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/license",
  kind: RequestKind.LICENSE,
  func: async (request: Request) => {
    const hotel = await System.hotels.getHotel({ request });

    if (!hotel || hotel.getObject().blocked)
      return getResponse(HttpStatusCode.BAD_REQUEST);

    const license = await hotel.getLicenseData();

    if (!license) return getResponse(HttpStatusCode.BAD_REQUEST);

    return getResponse(HttpStatusCode.OK, {
      data: {
        hotelId: license.hotelId,
        accountId: license.accountId,
        integrationId: license.integrationId,
      },
    });
  },
};
