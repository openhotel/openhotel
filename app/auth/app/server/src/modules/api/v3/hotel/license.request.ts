import {
  RequestType,
  RequestMethod,
  getResponse,
  HttpStatusCode,
} from "@oh/utils";
import { System } from "modules/system/main.ts";
import { RequestKind } from "shared/enums/request.enums.ts";

export const licenseGetRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/license",
  kind: RequestKind.LICENSE,
  func: async (request: Request) => {
    const hotel = await System.hotels.getHotel({ request });

    if (!hotel) return getResponse(HttpStatusCode.BAD_REQUEST);

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
