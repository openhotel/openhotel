import { RequestType, getPathRequestList } from "@oh/utils";
import { bskyPostRequest } from "./bsky.request.ts";

export const miscRequestList: RequestType[] = getPathRequestList({
  requestList: [bskyPostRequest],
  pathname: "/misc",
});
