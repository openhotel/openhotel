import { RequestType, getPathRequestList } from "@oh/utils";
import { deleteRequest } from "./delete.request.ts";
import { getRequest } from "./get.request.ts";
import { verifyGetRequest } from "./verify.request.ts";

export const otpRequestList: RequestType[] = getPathRequestList({
  requestList: [getRequest, deleteRequest, verifyGetRequest],
  pathname: "/otp",
});
