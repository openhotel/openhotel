import { RequestType } from "shared/types/request.types.ts";
import { getPathRequestList } from "shared/utils/main.ts";

import { versionRequest } from "./version.request.ts";
import { accountRequestList } from "./account/main.ts";
import { serverRequestList } from "./server/main.ts";

export const requestV2List: RequestType[] = getPathRequestList({
  requestList: [versionRequest, ...accountRequestList, ...serverRequestList],
  pathname: "/api/v2",
});
