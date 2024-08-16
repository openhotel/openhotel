import { ProxyEvent } from "shared/enums/event.enum.ts";

export const PROXY_CLIENT_EVENT_WHITELIST: ProxyEvent[] = [
  ProxyEvent.SET_LANGUAGE,
  ProxyEvent.JOIN_ROOM,
  ProxyEvent.LEAVE_ROOM,
  ProxyEvent.POINTER_TILE,
  ProxyEvent.MESSAGE,
  ProxyEvent.TYPING_START,
  ProxyEvent.TYPING_END,
];
