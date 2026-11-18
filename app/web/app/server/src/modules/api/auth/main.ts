import { requestRequest } from "modules/api/auth/request.request.ts";
import { userRequest } from "modules/api/auth/user.request.ts";
import { RequestType } from "@shared/types/request.types.ts";
import { getPathRequestList } from "@shared/utils/request.utils.ts";

export const authList: RequestType[] = getPathRequestList({
  requestList: [requestRequest, userRequest],
  pathname: "/auth",
});
