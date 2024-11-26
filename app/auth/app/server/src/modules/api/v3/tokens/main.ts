import { RequestType, getPathRequestList } from "@oh/utils";
import { checkGetRequest } from "./check.request.ts";

export const tokensRequestList: RequestType[] = getPathRequestList({
  requestList: [checkGetRequest],
  pathname: "/tokens",
});
