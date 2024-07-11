import { RequestType } from "shared/types/request.types.ts";

import { versionRequest } from "modules/api/v1/version.request.ts";
import { accountRequestList } from "./account/main.ts";
import { hotelRequestList } from "./hotel/main.ts";
import { getPathRequestList } from "shared/utils/main.ts";

export const requestV1List: RequestType[] = getPathRequestList({
  requestList: [versionRequest, ...accountRequestList, ...hotelRequestList],
  pathname: "/v1",
});
