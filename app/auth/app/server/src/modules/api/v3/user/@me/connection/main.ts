import {
  mainDeleteRequest,
  mainGetRequest,
  mainPostRequest,
} from "./main.request.ts";
import { pingGetRequest } from "./ping.request.ts";
import { RequestType } from "@shared/types/request.types.ts";
import { getPathRequestList } from "@shared/utils/request.utils.ts";

export const connectionRequestList: RequestType[] = getPathRequestList({
  requestList: [
    mainPostRequest,
    mainGetRequest,
    mainDeleteRequest,
    pingGetRequest,
  ],
  pathname: "/connection",
});
