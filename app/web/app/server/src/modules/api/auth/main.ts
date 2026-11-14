import { RequestType, getPathRequestList } from "@oh/utils";

import { requestRequest } from "modules/api/auth/request.request.ts";
import { userRequest } from "modules/api/auth/user.request.ts";

export const authList: RequestType[] = getPathRequestList({
  requestList: [requestRequest, userRequest],
  pathname: "/auth",
});
