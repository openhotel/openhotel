import { RequestType, getPathRequestList } from "@oh/utils";

import { versionRequest } from "./version.request.ts";

export const requestV1List: RequestType<unknown>[] = getPathRequestList({
  requestList: [versionRequest],
  pathname: "/api/v1",
});
