import { RequestType, getPathRequestList } from "@oh/utils";

import {
  accountGetRequest,
  accountPostRequest,
  accountDeleteRequest,
} from "./admin.request.ts";
import { updateGetRequest } from "./update.request.ts";
import { accountRequestList } from "./account/main.ts";
import { onetRequestList } from "./onet/main.ts";

export const adminRequestList: RequestType[] = getPathRequestList({
  requestList: [
    accountGetRequest,
    accountPostRequest,
    accountDeleteRequest,
    updateGetRequest,

    ...accountRequestList,
    ...onetRequestList,
  ],
  pathname: "/admin",
});
