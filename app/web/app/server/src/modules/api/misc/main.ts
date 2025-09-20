import { RequestType, getPathRequestList } from "@oh/utils";

import { versionRequest } from "./version.request.ts";

export const miscRequestList: RequestType[] = getPathRequestList({
  requestList: [versionRequest],
  pathname: "/_",
});
