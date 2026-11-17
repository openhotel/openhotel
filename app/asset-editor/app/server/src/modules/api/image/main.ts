import { base64Request } from "./base64.request.ts";
import { RequestType } from "@shared/types/request.types.ts";
import { getPathRequestList } from "@shared/utils/request.utils.ts";

export const imageList: RequestType[] = getPathRequestList({
  requestList: [base64Request],
  pathname: "/image",
});
