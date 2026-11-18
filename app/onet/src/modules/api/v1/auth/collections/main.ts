import { listRequest } from "./list.request.ts";
import { publishRequest } from "./publish.request.ts";
import { manifestRequest } from "./manifest.request.ts";
import { RequestType } from "@shared/types/request.types.ts";
import { getPathRequestList } from "@shared/utils/request.utils.ts";

export const authCollectionsRequestList: RequestType<unknown>[] =
  getPathRequestList({
    requestList: [listRequest, publishRequest, manifestRequest],
    pathname: "/collections",
  });
