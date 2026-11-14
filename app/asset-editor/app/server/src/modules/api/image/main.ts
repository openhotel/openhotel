import { RequestType, getPathRequestList } from "@oh/utils";

import { base64Request } from "./base64.request.ts";

export const imageList: RequestType[] = getPathRequestList({
  requestList: [base64Request],
  pathname: "/image",
});
