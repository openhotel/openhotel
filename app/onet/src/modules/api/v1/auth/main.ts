import { RequestType, getPathRequestList } from "@oh/utils";

import { checkRequest } from "./check.request.ts";
import { authCollectionsRequestList } from "./collections/main.ts";

export const authRequestList: RequestType<unknown>[] = getPathRequestList({
  requestList: [checkRequest, ...authCollectionsRequestList],
  pathname: "/auth",
});
