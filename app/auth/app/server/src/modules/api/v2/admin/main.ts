import { RequestType } from "shared/types/main.ts";
import { getPathRequestList } from "shared/utils/main.ts";

import {
  accountGetRequest,
  accountPostRequest,
  accountDeleteRequest,
} from "./admin.request.ts";

export const adminRequestList: RequestType[] = getPathRequestList({
  requestList: [accountGetRequest, accountPostRequest, accountDeleteRequest],
  pathname: "/admin",
});
