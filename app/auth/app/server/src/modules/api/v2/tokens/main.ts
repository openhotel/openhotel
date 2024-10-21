import { RequestType, getPathRequestList } from "@oh/utils";
import { getValidateRequest } from "./validate.request.ts";

export const tokensRequestList: RequestType[] = getPathRequestList({
  requestList: [getValidateRequest],
  pathname: "/tokens",
});
