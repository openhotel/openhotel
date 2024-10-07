import { RequestType, getPathRequestList } from "@oh/utils";

import { listGetRequest } from "./list.request.ts";

export const accountRequestList: RequestType[] = getPathRequestList({
  requestList: [listGetRequest],
  pathname: "/account",
});
