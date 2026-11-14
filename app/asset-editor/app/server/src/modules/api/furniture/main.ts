import { RequestType, getPathRequestList } from "@oh/utils";

import { importRequest } from "./import.request.ts";
import { createRequest } from "./create.request.ts";

export const furnitureList: RequestType[] = getPathRequestList({
  requestList: [importRequest, createRequest],
  pathname: "/furniture",
});
