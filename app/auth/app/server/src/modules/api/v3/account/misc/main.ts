import {
  githubDeleteRequest,
  githubGetRequest,
  githubPostRequest,
} from "./github.request.ts";
import { RequestType } from "@shared/types/request.types.ts";
import { getPathRequestList } from "@shared/utils/request.utils.ts";

export const miscRequestList: RequestType[] = getPathRequestList({
  requestList: [githubGetRequest, githubPostRequest, githubDeleteRequest],
  pathname: "/_",
});
