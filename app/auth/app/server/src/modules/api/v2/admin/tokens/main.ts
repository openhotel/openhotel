import { RequestType, getPathRequestList } from "@oh/utils";
import { postGenerateRequest } from "./generate.request.ts";
import { getListRequest } from "./list.request.ts";

export const tokensRequestList: RequestType[] = getPathRequestList({
  requestList: [postGenerateRequest, getListRequest],
  pathname: "/tokens",
});
