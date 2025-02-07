import { RequestType } from "shared/types/request.types.ts";
import { getPathRequestList } from "shared/utils/main.ts";

import { base64Request } from "./base64.request.ts";

export const imageList: RequestType[] = getPathRequestList({
  requestList: [base64Request],
  pathname: "/image",
});
