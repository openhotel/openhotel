import { redirectRequest } from "./redirect.request.ts";
import { userRequest } from "./user.request.ts";
import { getRequest } from "./main.request.ts";
import { RequestType } from "@shared/types/request.types.ts";
import { getPathRequestList } from "@shared/utils/request.utils.ts";

export const authList: RequestType[] = getPathRequestList({
  requestList: [getRequest, redirectRequest, userRequest],
  pathname: "/auth",
});
