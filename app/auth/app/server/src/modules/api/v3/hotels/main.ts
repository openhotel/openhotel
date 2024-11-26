import { RequestType, getPathRequestList } from "@oh/utils";

import { checkLicenseGetRequest } from "./check-license.request.ts";

export const hotelsRequestList: RequestType[] = getPathRequestList({
  requestList: [checkLicenseGetRequest],
  pathname: "/hotels",
});
