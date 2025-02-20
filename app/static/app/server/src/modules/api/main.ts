import { RequestType, getPathRequestList } from "@oh/utils";

import { versionRequest } from "./version.request.ts";
import { authList } from "./auth/main.ts";

export const requestList: RequestType[] = getPathRequestList({
  requestList: [versionRequest, ...authList],
  pathname: "/api",
});
