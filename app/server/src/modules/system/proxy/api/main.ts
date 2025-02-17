import { ProxyRequestType } from "shared/types/api.types.ts";
import { roomListRequest } from "./room-list.request.ts";
import { roomPutRequest, roomRequest } from "./room.request.ts";
import { onlineUsersRequest } from "./online-users.request.ts";
import { furnitureRequest } from "./furniture.request.ts";
import { catalogRequest } from "./catalog.request.ts";

export const requestList: ProxyRequestType[] = [
  roomListRequest,
  roomRequest,
  roomPutRequest,

  onlineUsersRequest,
  catalogRequest,
  furnitureRequest,
];
