import { getPathRequestList } from "shared/utils/main.ts";
import { listRequest } from "./list.request.ts";
import { getSpriteRequest, postSpriteRequest } from "./sprite.request.ts";
import {
  getSheetRequest,
  postSheetRequest,
  putSheetRequest,
} from "./sheet.request.ts";
import { deleteRequest } from "./delete.request.ts";
import { createRequest } from "./create.request.ts";

export const spriteSheetsRequestList = getPathRequestList({
  requestList: [
    listRequest,
    getSpriteRequest,
    postSpriteRequest,
    getSheetRequest,
    postSheetRequest,
    putSheetRequest,
    deleteRequest,
    createRequest,
  ],
  pathname: "/sprite-sheets",
});
