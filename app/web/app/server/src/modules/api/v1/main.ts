import { RequestType, getPathRequestList } from "@oh/utils";

import { getVersionRequest } from "./get-versionRequest.ts";
import { getConfigRequest } from "./get-config.request.ts";

export const requestV1List: RequestType[] = getPathRequestList({
  requestList: [getVersionRequest, getConfigRequest],
  pathname: "/api/v1",
});
