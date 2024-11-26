import { RequestType, getPathRequestList } from "@oh/utils";

import { versionRequest } from "./version.request.ts";

import { accountRequestList } from "./account/main.ts";
import { hotelsRequestList } from "./hotels/main.ts";
import { userRequestList } from "./user/main.ts";
import { tokensRequestList } from "./tokens/main.ts";
import { adminRequestList } from "./admin/main.ts";

export const requestV3List: RequestType[] = getPathRequestList({
  requestList: [
    versionRequest,

    ...accountRequestList,
    ...hotelsRequestList,
    ...userRequestList,
    ...tokensRequestList,
    ...adminRequestList,
  ],
  pathname: "/api/v3",
});
