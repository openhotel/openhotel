import { RequestType } from "shared/types/main.ts";
import { getPathRequestList } from "shared/utils/main.ts";

import {
  accountGetRequest,
  accountPostRequest,
  accountDeleteRequest,
} from "./admin.request.ts";
import { updateGetRequest } from "./update.request.ts";
import { accountRequestList } from "./account/main.ts";

export const adminRequestList: RequestType[] = getPathRequestList({
  requestList: [
    accountGetRequest,
    accountPostRequest,
    accountDeleteRequest,
    updateGetRequest,

    ...accountRequestList,
  ],
  pathname: "/admin",
});
