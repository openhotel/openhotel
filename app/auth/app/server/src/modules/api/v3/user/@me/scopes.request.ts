import {
  RequestMethod,
  RequestType,
  getResponse,
  HttpStatusCode,
  RequestKind,
} from "@oh/utils";
import { System } from "modules/system/main.ts";

export const scopesGetRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/scopes",
  kind: RequestKind.CONNECTION,
  func: async (request: Request) => {
    const account = await System.accounts.getAccount({ request });
    if (!account) return getResponse(HttpStatusCode.FORBIDDEN);

    const licenseToken = request.headers.get("license-token");
    const hotel = await System.hotels.getHotel({ licenseToken });
    const licenseData = await hotel.getLicenseData();
    const currentIntegration = hotel.getIntegration({
      integrationId: licenseData.integrationId,
    });
    const { type } = currentIntegration.getObject();

    const connection = await account.connections.active.get(type);
    if (!connection) return getResponse(HttpStatusCode.FORBIDDEN);

    return getResponse(HttpStatusCode.OK, {
      data: {
        scopes: connection.scopes,
      },
    });
  },
};
