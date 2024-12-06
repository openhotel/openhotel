import { RequestType, RequestMethod } from "@oh/utils";
import { System } from "modules/system/main.ts";
import { RequestKind } from "shared/enums/request.enums.ts";

export const licenseGetRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/license",
  kind: RequestKind.PUBLIC,
  func: async (request, url) => {
    const licenseToken = request.headers.get("license-token");

    if (
      !licenseToken ||
      !(await System.hotels.integrations.verify(licenseToken))
    )
      return Response.json(
        {
          status: 400,
        },
        { status: 400 },
      );
    const license = await System.hotels.integrations.getLicense(licenseToken);

    return Response.json(
      {
        status: 200,
        data: {
          hotelId: license.hotelId,
          accountId: license.accountId,
          integrationId: license.integrationId,
        },
      },
      { status: 200 },
    );
  },
};
