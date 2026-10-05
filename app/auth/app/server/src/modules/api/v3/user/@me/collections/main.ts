import { RequestType, getPathRequestList } from "@oh/utils";

import { mainGetRequest, mainPostRequest } from "./main.request.ts";

export const collectionsRequestList: RequestType[] = getPathRequestList({
  requestList: [mainGetRequest, mainPostRequest],
  pathname: "/collections",
});
