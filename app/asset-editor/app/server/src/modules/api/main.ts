import { RequestType } from "shared/types/request.types.ts";
import { getPathRequestList } from "shared/utils/main.ts";

import { dataRequestList } from "./data/main.ts";
import { spriteSheetsRequestList } from "./sprite-sheets/main.ts";
import { versionRequest } from "./version.request.ts";

export const requestList: RequestType[] = getPathRequestList({
  requestList: [versionRequest, ...dataRequestList, ...spriteSheetsRequestList],
  pathname: "/api",
});
