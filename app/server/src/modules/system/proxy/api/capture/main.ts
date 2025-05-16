import { RequestType, getPathRequestList } from "@oh/utils";

import { captureRequest } from "./capture.request.ts";
import { listRequest } from "./list.request.ts";

export const captureRequestList: RequestType[] = getPathRequestList({
  requestList: [captureRequest, listRequest],
  pathname: "/capture",
});
