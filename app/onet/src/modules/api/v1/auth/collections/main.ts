import { RequestType, getPathRequestList } from "@oh/utils";

import { listRequest } from "./list.request.ts";
import { publishRequest } from "./publish.request.ts";
import { manifestRequest } from "./manifest.request.ts";

export const authCollectionsRequestList: RequestType<unknown>[] =
  getPathRequestList({
    requestList: [listRequest, publishRequest, manifestRequest],
    pathname: "/collections",
  });
