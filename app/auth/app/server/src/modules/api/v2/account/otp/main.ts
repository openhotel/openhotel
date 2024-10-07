import { RequestType, getPathRequestList } from "@oh/utils";

import { postRequest } from "modules/api/v2/account/otp/post.request.ts";
import { verifyRequest } from "./verify.request.ts";
import { deleteRequest } from "./delete.request.ts";

export const otpRequestList: RequestType[] = getPathRequestList({
  requestList: [postRequest, verifyRequest, deleteRequest],
  pathname: "/otp",
});
