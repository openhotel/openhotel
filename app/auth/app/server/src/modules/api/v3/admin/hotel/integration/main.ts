import { RequestType, getPathRequestList } from "@oh/utils";

import { mainDeleteRequest } from "./main.request.ts";

export const integrationRequestList: RequestType[] = getPathRequestList({
  requestList: [mainDeleteRequest],
  pathname: "/integration",
});
