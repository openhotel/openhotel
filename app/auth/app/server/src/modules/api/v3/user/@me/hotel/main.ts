import { RequestType, getPathRequestList } from "@oh/utils";

import {
  mainDeleteRequest,
  mainGetRequest,
  mainPatchRequest,
  mainPostRequest,
} from "./main.request.ts";
import { integrationRequestList } from "./integration/main.ts";

export const hotelRequestList: RequestType[] = getPathRequestList({
  requestList: [
    mainGetRequest,
    mainPostRequest,
    mainPatchRequest,
    mainDeleteRequest,
    ...integrationRequestList,
  ],
  pathname: "/hotel",
});
