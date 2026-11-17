import { meRequestList } from "./@me/main.ts";
import { countRequest } from "./count.request.ts";
import { RequestType } from "@shared/types/request.types.ts";
import { getPathRequestList } from "@shared/utils/request.utils.ts";

export const userRequestList: RequestType[] = getPathRequestList({
  requestList: [...meRequestList, countRequest],
  pathname: "/user",
});
