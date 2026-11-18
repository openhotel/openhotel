import { catalogRequest } from "./catalog.request.ts";
import { catalogBuyRequest } from "./buy.request.ts";
import { RequestType } from "@shared/types/request.types.ts";
import { getPathRequestList } from "@shared/utils/request.utils.ts";

export const requestList: RequestType[] = getPathRequestList({
  requestList: [catalogRequest, catalogBuyRequest],
  pathname: "/catalog",
});
