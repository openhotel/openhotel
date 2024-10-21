import { RequestType, getPathRequestList } from "@oh/utils";

import { serverRequest } from "modules/api/v2/onet/server.request.ts";
import { validateAccountRequest } from "./validate-account.request.ts";

export const onetRequestList: RequestType[] = getPathRequestList({
  requestList: [serverRequest, validateAccountRequest],
  pathname: "/onet",
});
