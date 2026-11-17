import { miscRequestList } from "./misc/main.ts";
import { authList } from "./auth/main.ts";
import { RequestType } from "@shared/types/request.types.ts";
import { getPathRequestList } from "@shared/utils/request.utils.ts";

export const requestV1List: RequestType[] = getPathRequestList({
  requestList: [...miscRequestList, ...authList],
  pathname: "/api",
});
