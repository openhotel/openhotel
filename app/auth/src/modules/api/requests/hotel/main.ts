import { RequestType } from "shared/types/main.ts";
import { getPathRequestList } from "shared/utils/main.ts";

import { createRequest } from "./create.request.ts";
import { deleteRequest } from "./delete.request.ts";

export const hotelRequestList: RequestType[] = getPathRequestList({
  requestList: [createRequest, deleteRequest],
  pathname: "/hotel",
});
