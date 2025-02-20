import { RequestType, getPathRequestList } from "@oh/utils";

import { versionRequest } from "./version.request.ts";

import { furnitureList } from "./furniture/main.ts";
import { imageList } from "./image/main.ts";
import { authList } from "./auth/main.ts";

export const requestList: RequestType[] = getPathRequestList({
  requestList: [versionRequest, ...furnitureList, ...imageList, ...authList],
  pathname: "/api",
});
