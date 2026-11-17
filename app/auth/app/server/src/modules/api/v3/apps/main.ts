import { checkGetRequest } from "./check.request.ts";
import { RequestType } from "@shared/types/request.types.ts";
import { getPathRequestList } from "@shared/utils/request.utils.ts";

export const appsRequestList: RequestType[] = getPathRequestList({
  requestList: [checkGetRequest],
  pathname: "/apps",
});
