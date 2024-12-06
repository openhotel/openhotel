import { RequestType, getPathRequestList } from "@oh/utils";

import { licenseGetRequest } from "./license.request.ts";
import { mainGetRequest } from "./main.request.ts";

export const hotelRequestList: RequestType[] = getPathRequestList({
  requestList: [mainGetRequest, licenseGetRequest],
  pathname: "/hotel",
});
