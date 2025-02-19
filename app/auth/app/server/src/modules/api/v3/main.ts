import { RequestType, getPathRequestList } from "@oh/utils";

import { versionRequest } from "./version.request.ts";

import { accountRequestList } from "./account/main.ts";
import { hotelRequestList } from "./hotel/main.ts";
import { userRequestList } from "./user/main.ts";
import { tokensRequestList } from "./tokens/main.ts";
import { adminRequestList } from "./admin/main.ts";
import { dataRequestList } from "./data/main.ts";
import { appsRequestList } from "./apps/main.ts";

export const requestV3List: RequestType[] = getPathRequestList({
  requestList: [
    versionRequest,

    ...accountRequestList,
    ...hotelRequestList,
    ...userRequestList,
    ...tokensRequestList,
    ...appsRequestList,
    ...adminRequestList,
    ...dataRequestList,
  ],
  pathname: "/api/v3",
});
