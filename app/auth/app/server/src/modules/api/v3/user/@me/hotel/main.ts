import {
  mainDeleteRequest,
  mainGetRequest,
  mainPatchRequest,
  mainPostRequest,
} from "./main.request.ts";
import { integrationRequestList } from "./integration/main.ts";
import { RequestType } from "@shared/types/request.types.ts";
import { getPathRequestList } from "@shared/utils/request.utils.ts";

export const hotelRequestList: RequestType[] = getPathRequestList({
  requestList: [
    mainGetRequest,
    mainPostRequest,
    mainPatchRequest,
    mainDeleteRequest,
    ...integrationRequestList,
  ],
  pathname: "/hotel",
});
