import { checkRequest } from "./check.request.ts";
import { authCollectionsRequestList } from "./collections/main.ts";
import { RequestType } from "@shared/types/request.types.ts";
import { getPathRequestList } from "@shared/utils/request.utils.ts";

export const authRequestList: RequestType<unknown>[] = getPathRequestList({
  requestList: [checkRequest, ...authCollectionsRequestList],
  pathname: "/auth",
});
