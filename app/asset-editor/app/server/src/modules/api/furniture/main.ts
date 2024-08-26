import { getPathRequestList } from "shared/utils/main.ts";
import { listRequest } from "./list.request.ts";
import { createRequest } from "./create.request.ts";
import { deleteRequest } from "./delete.request.ts";
import { getDataRequest, postDataRequest } from "./data.request.ts";
import { getLangRequest, postLangRequest } from "./lang.request.ts";
import { exportRequest } from "./export.request.ts";

export const furnitureRequestList = getPathRequestList({
  requestList: [
    listRequest,
    createRequest,
    deleteRequest,
    getDataRequest,
    postDataRequest,
    getLangRequest,
    postLangRequest,
    exportRequest,
  ],
  pathname: "/furniture",
});
