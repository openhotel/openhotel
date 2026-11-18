import { languagesRequest } from "./language.request.ts";
import { RequestType } from "@shared/types/request.types.ts";
import { getPathRequestList } from "@shared/utils/request.utils.ts";

export const dataRequestList: RequestType[] = getPathRequestList({
  requestList: [languagesRequest],
  pathname: "/data",
});
