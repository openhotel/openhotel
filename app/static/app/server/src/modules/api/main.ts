import { RequestType, getPathRequestList } from "@oh/utils";

import { versionRequest } from "./version.request.ts";
import { authList } from "./auth/main.ts";
import { filesList } from "./files/main.ts";

export const requestList: RequestType[] = getPathRequestList({
  requestList: [versionRequest, ...authList, ...filesList],
  pathname: "/api",
});
