import { RequestType, getPathRequestList } from "@oh/utils";

import { getRequest } from "./main.request.ts";
import { putRequest } from "./put.request.ts";
import { deleteRequest } from "./delete.request.ts";

export const filesList: RequestType[] = getPathRequestList({
  requestList: [getRequest, putRequest, deleteRequest],
  pathname: "/files",
});
