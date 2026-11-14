import { RequestType, getPathRequestList } from "@oh/utils";

import { connectionGetRequest } from "./connection.request.ts";

export const userRequestList: RequestType[] = getPathRequestList({
  requestList: [connectionGetRequest],
  pathname: "/user",
});
