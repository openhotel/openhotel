import { RequestType, getPathRequestList } from "@oh/utils";

import { setForSaleRequest } from "./set-for-sale.request.ts";
import { unsetForSaleRequest } from "./unset-for-sale.request.ts";
import { buyFurnitureRequest } from "./buy.request.ts";

export const furnitureRequestList: RequestType[] = getPathRequestList({
  requestList: [setForSaleRequest, unsetForSaleRequest, buyFurnitureRequest],
  pathname: "/furniture",
});
