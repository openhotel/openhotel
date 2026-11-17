import { checkGetRequest } from "./check.request.ts";
import { userRequestList } from "./user/main.ts";
import { RequestType } from "@shared/types/request.types.ts";
import { getPathRequestList } from "@shared/utils/request.utils.ts";

export const tokensRequestList: RequestType[] = getPathRequestList({
  requestList: [checkGetRequest, ...userRequestList],
  pathname: "/tokens",
});
