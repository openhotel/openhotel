import { RequestType } from "shared/types/main.ts";
import { getPathRequestList } from "shared/utils/main.ts";

import { postRequest } from "modules/api/v2/account/otp/post.request.ts";
import { verifyRequest } from "./verify.request.ts";
import { deleteRequest } from "./delete.request.ts";

export const otpRequestList: RequestType[] = getPathRequestList({
  requestList: [postRequest, verifyRequest, deleteRequest],
  pathname: "/otp",
});
