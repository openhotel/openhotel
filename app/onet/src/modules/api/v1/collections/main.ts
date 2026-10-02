import { RequestType, getPathRequestList } from "@oh/utils";

import { listRequest } from "./list.request.ts";
import { manifestRequest } from "./manifest.request.ts";
import { filesRequest } from "./files.request.ts";

export const collectionsRequestList: RequestType<unknown>[] =
  getPathRequestList({
    requestList: [listRequest, manifestRequest, filesRequest],
    pathname: "/collections",
  });
