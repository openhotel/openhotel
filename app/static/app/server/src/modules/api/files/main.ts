import { getRequest } from "./main.request.ts";
import { putRequest } from "./put.request.ts";
import { deleteRequest } from "./delete.request.ts";
import { RequestType } from "@shared/types/request.types.ts";
import { getPathRequestList } from "@shared/utils/request.utils.ts";

export const filesList: RequestType[] = getPathRequestList({
  requestList: [getRequest, putRequest, deleteRequest],
  pathname: "/files",
});
