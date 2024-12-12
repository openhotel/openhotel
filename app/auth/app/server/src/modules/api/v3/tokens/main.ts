import { RequestType, getPathRequestList } from "@oh/utils";
import { checkGetRequest } from "./check.request.ts";
import { userRequestList } from "./user/main.ts";

export const tokensRequestList: RequestType[] = getPathRequestList({
  requestList: [checkGetRequest, ...userRequestList],
  pathname: "/tokens",
});
