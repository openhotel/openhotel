import { captureRequest } from "./capture.request.ts";
import { listRequest } from "./list.request.ts";

import { RequestType } from "@shared/types/request.types.ts";
import { getPathRequestList } from "@shared/utils/request.utils.ts";

export const captureRequestList: RequestType[] = getPathRequestList({
  requestList: [captureRequest, listRequest],
  pathname: "/capture",
});
