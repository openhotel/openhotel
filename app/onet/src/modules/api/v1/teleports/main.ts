import { RequestType, getPathRequestList } from "@oh/utils";

import { linkRequest } from "./link.request.ts";
import { getRequest } from "./get.request.ts";

export const teleportsRequestList: RequestType<unknown>[] = getPathRequestList({
  requestList: [linkRequest, getRequest],
  pathname: "/teleports",
});
