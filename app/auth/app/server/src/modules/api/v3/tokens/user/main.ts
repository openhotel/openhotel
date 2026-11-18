import { connectionGetRequest } from "./connection.request.ts";
import { RequestType } from "@shared/types/request.types.ts";
import { getPathRequestList } from "@shared/utils/request.utils.ts";

export const userRequestList: RequestType[] = getPathRequestList({
  requestList: [connectionGetRequest],
  pathname: "/user",
});
