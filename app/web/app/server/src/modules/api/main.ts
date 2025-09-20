import { RequestType, getPathRequestList } from "@oh/utils";

import { miscRequestList } from "./misc/main.ts";
import { authList } from "./auth/main.ts";

export const requestV1List: RequestType[] = getPathRequestList({
  requestList: [...miscRequestList, ...authList],
  pathname: "/api",
});
