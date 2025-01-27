import { RequestType, getPathRequestList } from "@oh/utils";
import { bskyPostRequest } from "./bsky.request.ts";
import {
  githubDeleteRequest,
  githubGetRequest,
  githubPostRequest,
} from "./github.request.ts";

export const miscRequestList: RequestType[] = getPathRequestList({
  requestList: [
    bskyPostRequest,
    githubGetRequest,
    githubPostRequest,
    githubDeleteRequest,
  ],
  pathname: "/misc",
});
