import { RequestType, getPathRequestList } from "@oh/utils";

import { licenseGetRequest } from "./license.request.ts";
import { mainGetRequest } from "./main.request.ts";
import { listRequest } from "./list.request.ts";

export const hotelRequestList: RequestType[] = getPathRequestList({
  requestList: [mainGetRequest, licenseGetRequest, listRequest],
  pathname: "/hotel",
});
