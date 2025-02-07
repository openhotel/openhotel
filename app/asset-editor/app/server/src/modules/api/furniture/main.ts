import { RequestType } from "shared/types/request.types.ts";
import { getPathRequestList } from "shared/utils/main.ts";

import { importRequest } from "./import.request.ts";
import { createRequest } from "./create.request.ts";

export const furnitureList: RequestType[] = getPathRequestList({
  requestList: [importRequest, createRequest],
  pathname: "/furniture",
});
