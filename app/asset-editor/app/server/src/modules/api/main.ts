import { RequestType } from "shared/types/request.types.ts";
import { getPathRequestList } from "shared/utils/main.ts";

import { versionRequest } from "./version.request.ts";

export const requestList: RequestType[] = getPathRequestList({
  requestList: [versionRequest],
  pathname: "/api",
});
