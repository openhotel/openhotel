import { getPathRequestList } from "@oh/utils";
import { marketplaceRequest } from "./marketplace.request.ts";
import { marketplaceListRequest } from "./list.request.ts";
import { marketplaceCancelRequest } from "./cancel.request.ts";
import { marketplacePriceLimitsRequest } from "./price-limits.request.ts";

export const marketplaceRequestList = getPathRequestList({
  requestList: [
    marketplaceRequest,
    marketplaceListRequest,
    marketplaceCancelRequest,
    marketplacePriceLimitsRequest,
  ],
  pathname: "/marketplace",
});
