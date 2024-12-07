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
  kind: RequestKind.PUBLIC,
  func: async (request: Request) => {
    const licenseToken = request.headers.get("license-token");

    if (
      !licenseToken ||
      !(await System.hotels.integrations.verify(licenseToken))
    )
      return getResponse(HttpStatusCode.BAD_REQUEST);

    const license = await System.hotels.integrations.getLicense(licenseToken);

    return getResponse(HttpStatusCode.OK, {
      data: {
        hotelId: license.hotelId,
        accountId: license.accountId,
        integrationId: license.integrationId,
      },
    });
  },
};
