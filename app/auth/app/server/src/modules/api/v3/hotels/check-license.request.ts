import { RequestType, RequestMethod } from "@oh/utils";
import { System } from "modules/system/main.ts";
import { RequestKind } from "shared/enums/request.enums.ts";

export const checkLicenseGetRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/check-license",
  kind: RequestKind.PUBLIC,
  func: async (request, url) => {
    const licenseToken = request.headers.get("license-token");

    if (!licenseToken)
      return Response.json(
        {
          status: 400,
        },
        { status: 400 },
      );
    const valid = await System.licenses.verify(licenseToken);

    return Response.json(
      {
        status: 200,
        data: {
          valid,
        },
      },
      { status: 200 },
    );
  },
};
