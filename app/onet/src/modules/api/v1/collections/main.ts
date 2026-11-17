import { listRequest } from "./list.request.ts";
import { manifestRequest } from "./manifest.request.ts";
import { filesRequest } from "./files.request.ts";
import { RequestType } from "@shared/types/request.types.ts";
import { getPathRequestList } from "@shared/utils/request.utils.ts";

export const collectionsRequestList: RequestType<unknown>[] =
  getPathRequestList({
    requestList: [listRequest, manifestRequest, filesRequest],
    pathname: "/collections",
  });
