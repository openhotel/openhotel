import { RequestType, getPathRequestList } from "@oh/utils";

import { serverRequest } from "./server.request.ts";
import { validateAccountRequest } from "./validate-account.request.ts";
import { getRequest } from "./get.request.ts";

export const onetRequestList: RequestType[] = getPathRequestList({
  requestList: [getRequest, serverRequest, validateAccountRequest],
  pathname: "/onet",
});
