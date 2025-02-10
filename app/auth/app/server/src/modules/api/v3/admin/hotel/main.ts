import { RequestType, getPathRequestList } from "@oh/utils";

import {
  mainGetRequest,
  mainDeleteRequest,
  mainPatchRequest,
} from "./main.request.ts";
import { integrationRequestList } from "./integration/main.ts";

export const hotelRequestList: RequestType[] = getPathRequestList({
  requestList: [
    mainGetRequest,
    mainPatchRequest,
    mainDeleteRequest,
    ...integrationRequestList,
  ],
  pathname: "/hotel",
});
