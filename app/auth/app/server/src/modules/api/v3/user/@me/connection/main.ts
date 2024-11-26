import { RequestType, getPathRequestList } from "@oh/utils";

import {
  mainDeleteRequest,
  mainGetRequest,
  mainPostRequest,
} from "./main.request.ts";
import { pingGetRequest } from "./ping.request.ts";

export const connectionRequestList: RequestType[] = getPathRequestList({
  requestList: [
    mainPostRequest,
    mainGetRequest,
    mainDeleteRequest,
    pingGetRequest,
  ],
  pathname: "/connection",
});
