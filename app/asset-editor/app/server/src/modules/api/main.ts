import { RequestType } from "shared/types/request.types.ts";
import { getPathRequestList } from "shared/utils/main.ts";

import { versionRequest } from "./version.request.ts";

import { furnitureList } from "./furniture/main.ts";
import { imageList } from "./image/main.ts";

export const requestList: RequestType[] = getPathRequestList({
  requestList: [versionRequest, ...furnitureList, ...imageList],
  pathname: "/api",
});
