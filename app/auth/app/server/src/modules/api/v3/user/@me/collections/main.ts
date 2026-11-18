import { mainGetRequest, mainPostRequest } from "./main.request.ts";
import { RequestType } from "@shared/types/request.types.ts";
import { getPathRequestList } from "@shared/utils/request.utils.ts";

export const collectionsRequestList: RequestType[] = getPathRequestList({
  requestList: [mainGetRequest, mainPostRequest],
  pathname: "/collections",
});
