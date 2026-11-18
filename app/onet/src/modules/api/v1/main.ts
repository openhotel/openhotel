import { versionRequest } from "./version.request.ts";

import { teleportsRequestList } from "./teleports/main.ts";
import { collectionsRequestList } from "./collections/main.ts";
import { authRequestList } from "./auth/main.ts";
import { RequestType } from "@shared/types/request.types.ts";
import { getPathRequestList } from "@shared/utils/request.utils.ts";

export const requestV1List: RequestType<unknown>[] = getPathRequestList({
  requestList: [
    versionRequest,
    ...teleportsRequestList,
    ...collectionsRequestList,
    ...authRequestList,
  ],
  pathname: "/api/v1",
});
