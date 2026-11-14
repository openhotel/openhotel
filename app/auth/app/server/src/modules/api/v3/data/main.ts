import { RequestType, getPathRequestList } from "@oh/utils";

import { languagesRequest } from "./language.request.ts";

export const dataRequestList: RequestType[] = getPathRequestList({
  requestList: [languagesRequest],
  pathname: "/data",
});
