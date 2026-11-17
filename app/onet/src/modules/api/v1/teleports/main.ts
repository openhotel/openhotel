import { linkRequest } from "./link.request.ts";
import { getRequest } from "./get.request.ts";
import { RequestType } from "@shared/types/request.types.ts";
import { getPathRequestList } from "@shared/utils/request.utils.ts";

export const teleportsRequestList: RequestType<unknown>[] = getPathRequestList({
  requestList: [linkRequest, getRequest],
  pathname: "/teleports",
});
