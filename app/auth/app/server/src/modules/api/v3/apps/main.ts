import { RequestType, getPathRequestList } from "@oh/utils";
import { checkGetRequest } from "./check.request.ts";

export const appsRequestList: RequestType[] = getPathRequestList({
  requestList: [checkGetRequest],
  pathname: "/apps",
});
