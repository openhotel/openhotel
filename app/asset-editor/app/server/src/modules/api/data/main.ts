import { getPathRequestList } from "shared/utils/main.ts";
import { getMkDirRequest } from "./mk-dir.request.ts";
import { getReadDirRequest } from "./read-dir.request.ts";
import { postWriteFileRequest } from "./write-file.request.ts";
import { getReadFileRequest } from "./read-file.request.ts";
import { getRmFileRequest } from "./rm-file.request.ts";

export const dataRequestList = getPathRequestList({
  requestList: [
    getMkDirRequest,
    getReadDirRequest,
    postWriteFileRequest,
    getReadFileRequest,
    getRmFileRequest,
  ],
  pathname: "/data",
});
