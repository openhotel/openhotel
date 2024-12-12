import { RequestType, getPathRequestList } from "@oh/utils";

import { versionRequest } from "./version.request.ts";

import { teleportsRequestList } from "./teleports/main.ts";

export const requestV1List: RequestType<unknown>[] = getPathRequestList({
  requestList: [versionRequest, ...teleportsRequestList],
  pathname: "/api/v1",
});
