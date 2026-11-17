import { deleteRequest } from "./delete.request.ts";
import { getRequest } from "./get.request.ts";
import { verifyGetRequest } from "./verify.request.ts";
import { RequestType } from "@shared/types/request.types.ts";
import { getPathRequestList } from "@shared/utils/request.utils.ts";

export const otpRequestList: RequestType[] = getPathRequestList({
  requestList: [getRequest, deleteRequest, verifyGetRequest],
  pathname: "/otp",
});
