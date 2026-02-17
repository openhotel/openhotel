import { RequestType, getPathRequestList } from "@oh/utils";

import { onlineUsersRequest } from "./online-users.request.ts";
import { furnitureRequest } from "./furniture.request.ts";
import { tokenRequest } from "./token.request.ts";
import { economyRequest } from "./economy.request.ts";
import { inventoryRequest } from "./inventory.request.ts";

import { requestList as catalogRequestList } from "./catalog/main.ts";
import { requestList as companiesRequestList } from "./company/main.ts";
import { roomRequestList } from "./room/main.ts";
import { captureRequestList } from "./capture/main.ts";
import { gameRequestList } from "./game/main.ts";
import { marketplaceRequestList } from "./marketplace/main.ts";

export const requestList: RequestType[] = getPathRequestList({
  requestList: [
    onlineUsersRequest,
    furnitureRequest,

    tokenRequest,

    economyRequest,

    inventoryRequest,

    ...catalogRequestList,
    ...companiesRequestList,
    ...roomRequestList,
    ...captureRequestList,
    ...gameRequestList,
    ...marketplaceRequestList,
  ],
  pathname: "",
});
