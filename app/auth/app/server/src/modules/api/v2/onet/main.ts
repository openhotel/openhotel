import { RequestType, getPathRequestList } from "@oh/utils";

import { getRequest } from "./main.request.ts";
import { validateRequest } from "./validate.request.ts";
import { serverRequest } from "modules/api/v2/onet/server.request.ts";
import { validateAccountRequest } from "./validate-account.request.ts";

export const onetRequestList: RequestType[] = getPathRequestList({
  requestList: [
    getRequest,
    validateRequest,
    serverRequest,
    validateAccountRequest,
  ],
  pathname: "/onet",
});
