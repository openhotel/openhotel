import { ProxyEvent } from "shared/enums/event.enum.ts";

export const PROXY_CLIENT_EVENT_WHITELIST: ProxyEvent[] = [
  ProxyEvent.JOIN_ROOM,
  ProxyEvent.LEAVE_ROOM,
  ProxyEvent.POINTER_TILE,
  ProxyEvent.NEXT_PATH_TILE,
  ProxyEvent.MESSAGE,
  ProxyEvent.TYPING_START,
  ProxyEvent.TYPING_END,
];
