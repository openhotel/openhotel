import { RequestType, getPathRequestList } from "@oh/utils";

import { postCreateRequest } from "./create.request.ts";

export const atRequestList: RequestType[] = getPathRequestList({
  requestList: [postCreateRequest],
  pathname: "/at",
});
