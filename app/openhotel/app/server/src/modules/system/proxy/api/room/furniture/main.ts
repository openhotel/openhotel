import { setForSaleRequest } from "./set-for-sale.request.ts";
import { unsetForSaleRequest } from "./unset-for-sale.request.ts";
import { buyFurnitureRequest } from "./buy.request.ts";
import { RequestType } from "@shared/types/request.types.ts";
import { getPathRequestList } from "@shared/utils/request.utils.ts";

export const furnitureRequestList: RequestType[] = getPathRequestList({
  requestList: [setForSaleRequest, unsetForSaleRequest, buyFurnitureRequest],
  pathname: "/furniture",
});
