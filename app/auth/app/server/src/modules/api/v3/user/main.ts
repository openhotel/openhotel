import { RequestType, getPathRequestList } from "@oh/utils";

import { meRequestList } from "./@me/main.ts";
import { countRequest } from "./count.request.ts";

export const userRequestList: RequestType[] = getPathRequestList({
  requestList: [...meRequestList, countRequest],
  pathname: "/user",
});
