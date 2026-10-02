import { RequestType, getPathRequestList } from "@oh/utils";

import { versionRequest } from "./version.request.ts";

import { teleportsRequestList } from "./teleports/main.ts";
import { collectionsRequestList } from "./collections/main.ts";

export const requestV1List: RequestType<unknown>[] = getPathRequestList({
  requestList: [
    versionRequest,
    ...teleportsRequestList,
    ...collectionsRequestList,
  ],
  pathname: "/api/v1",
});
