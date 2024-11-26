import { RequestType, getPathRequestList } from "@oh/utils";

import { mainGetRequest } from "./main.request.ts";

export const licenseRequestList: RequestType[] = getPathRequestList({
  requestList: [mainGetRequest],
  pathname: "/license",
});
