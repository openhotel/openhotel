import { ProxyRequestType } from "shared/types/api.types.ts";
import { roomListRequest } from "./room-list.request.ts";
import { roomRequest } from "./room.request.ts";
import { onlineUsersRequest } from "./online-users.request.ts";

export const requestList: ProxyRequestType[] = [
  roomListRequest,
  roomRequest,
  onlineUsersRequest,
];
