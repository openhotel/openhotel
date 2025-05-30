import { RequestType, getPathRequestList } from "@oh/utils";

import { miscRequestList } from "./misc/main.ts";

export const requestV1List: RequestType[] = getPathRequestList({
  requestList: [...miscRequestList],
  pathname: "/api/v1",
});
