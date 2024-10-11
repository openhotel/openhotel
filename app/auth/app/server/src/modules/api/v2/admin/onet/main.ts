import { RequestType, getPathRequestList } from "@oh/utils";
import { generateKeyPostRequest } from "./generate-key.request.ts";

export const onetRequestList: RequestType[] = getPathRequestList({
  requestList: [generateKeyPostRequest],
  pathname: "/onet",
});
