import { RequestType, getPathRequestList } from "@oh/utils";
import { catalogRequest } from "./catalog.request.ts";
import { catalogBuyRequest } from "./buy.request.ts";

export const requestList: RequestType[] = getPathRequestList({
  requestList: [catalogRequest, catalogBuyRequest],
  pathname: "/catalog",
});
