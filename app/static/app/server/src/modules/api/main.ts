import { versionRequest } from "./version.request.ts";
import { authList } from "./auth/main.ts";
import { filesList } from "./files/main.ts";
import { RequestType } from "@shared/types/request.types.ts";
import { getPathRequestList } from "@shared/utils/request.utils.ts";

export const requestList: RequestType[] = getPathRequestList({
  requestList: [versionRequest, ...authList, ...filesList],
  pathname: "/api",
});
