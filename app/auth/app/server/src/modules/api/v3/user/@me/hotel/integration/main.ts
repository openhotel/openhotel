import { RequestType, getPathRequestList } from "@oh/utils";

import {
  mainDeleteRequest,
  mainGetRequest,
  mainPostRequest,
} from "./main.request.ts";

export const integrationRequestList: RequestType[] = getPathRequestList({
  requestList: [mainPostRequest, mainGetRequest, mainDeleteRequest],
  pathname: "/integration",
});
