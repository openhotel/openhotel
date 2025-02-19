import { RequestType, getPathRequestList } from "@oh/utils";
import { checkGetRequest } from "./check.request.ts";

export const thirdPartyRequestList: RequestType[] = getPathRequestList({
  requestList: [checkGetRequest],
  pathname: "/third-party",
});
