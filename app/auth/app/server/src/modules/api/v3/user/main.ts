import { RequestType, getPathRequestList } from "@oh/utils";

import { meRequestList } from "./@me/main.ts";

export const userRequestList: RequestType[] = getPathRequestList({
  requestList: [...meRequestList],
  pathname: "/user",
});
