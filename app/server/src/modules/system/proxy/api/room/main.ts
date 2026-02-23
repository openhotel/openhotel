import { RequestType, getPathRequestList } from "@oh/utils";

import { roomPutRequest, roomRequest } from "./room.request.ts";
import { listRequest } from "./list.request.ts";
import { layoutRequest } from "./layout.request.ts";
import { layoutsRequest } from "./layouts.request.ts";
import { furnitureRequestList } from "./furniture/main.ts";

export const roomRequestList: RequestType[] = getPathRequestList({
  requestList: [
    roomRequest,
    roomPutRequest,
    listRequest,
    layoutRequest,
    layoutsRequest,
    ...furnitureRequestList,
  ],
  pathname: "/room",
});
