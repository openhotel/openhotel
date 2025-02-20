import { RequestType } from "shared/types/request.types.ts";
import { getPathRequestList } from "shared/utils/main.ts";

import { redirectRequest } from "./redirect.request.ts";
import { userRequest } from "./user.request.ts";
import { getRequest } from "./main.request.ts";

export const authList: RequestType[] = getPathRequestList({
  requestList: [getRequest, redirectRequest, userRequest],
  pathname: "/auth",
});
