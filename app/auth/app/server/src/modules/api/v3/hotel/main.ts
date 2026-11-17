import { licenseGetRequest } from "./license.request.ts";
import { mainGetRequest } from "./main.request.ts";
import { listRequest } from "./list.request.ts";
import { RequestType } from "@shared/types/request.types.ts";
import { getPathRequestList } from "@shared/utils/request.utils.ts";

export const hotelRequestList: RequestType[] = getPathRequestList({
  requestList: [mainGetRequest, licenseGetRequest, listRequest],
  pathname: "/hotel",
});
