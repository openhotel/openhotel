import { marketplaceRequest } from "./marketplace.request.ts";
import { marketplaceListRequest } from "./list.request.ts";
import { marketplaceCancelRequest } from "./cancel.request.ts";
import { marketplacePriceLimitsRequest } from "./price-limits.request.ts";

import { getPathRequestList } from "@shared/utils/request.utils.ts";

export const marketplaceRequestList = getPathRequestList({
  requestList: [
    marketplaceRequest,
    marketplaceListRequest,
    marketplaceCancelRequest,
    marketplacePriceLimitsRequest,
  ],
  pathname: "/marketplace",
});
