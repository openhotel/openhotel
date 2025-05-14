import { RequestType, getPathRequestList } from "@oh/utils";

import { roomPutRequest, roomRequest } from "./room.request.ts";
import { listRequest } from "./list.request.ts";
import { layoutRequest } from "./layout.request.ts";
import { layoutsRequest } from "./layouts.request.ts";

export const roomRequestList: RequestType[] = getPathRequestList({
  requestList: [
    roomRequest,
    roomPutRequest,
    listRequest,
    layoutRequest,
    layoutsRequest,
  ],
  pathname: "/room",
});
