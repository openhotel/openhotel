import { RequestType } from "shared/types/main.ts";
import { getPathRequestList } from "shared/utils/main.ts";
import { listGetRequest } from "./list.request.ts";

export const accountRequestList: RequestType[] = getPathRequestList({
  requestList: [listGetRequest],
  pathname: "/account",
});
