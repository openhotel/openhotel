import { RequestType, getPathRequestList } from "@oh/utils";
import {
  githubDeleteRequest,
  githubGetRequest,
  githubPostRequest,
} from "./github.request.ts";

export const miscRequestList: RequestType[] = getPathRequestList({
  requestList: [githubGetRequest, githubPostRequest, githubDeleteRequest],
  pathname: "/_",
});
