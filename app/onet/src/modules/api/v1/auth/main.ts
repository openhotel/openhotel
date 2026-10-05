import { RequestType, getPathRequestList } from "@oh/utils";

import { checkRequest } from "./check.request.ts";

export const authRequestList: RequestType<unknown>[] = getPathRequestList({
  requestList: [checkRequest],
  pathname: "/auth",
});
