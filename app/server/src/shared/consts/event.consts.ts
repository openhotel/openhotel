import { ProxyEvent } from "shared/enums/event.enum.ts";

export const PROXY_CLIENT_EVENT_WHITELIST: ProxyEvent[] = [
  ProxyEvent.PRE_JOIN_ROOM,
  ProxyEvent.JOIN_ROOM,
  ProxyEvent.LEAVE_ROOM,
  ProxyEvent.POINTER_TILE,
  ProxyEvent.POINTER_INTERACTIVE,
  ProxyEvent.PLACE_ITEM,
  ProxyEvent.MESSAGE,
  ProxyEvent.TYPING_START,
  ProxyEvent.TYPING_END,
  ProxyEvent.ROTATE_FURNITURE,
  ProxyEvent.PICK_UP_FURNITURE,
  ProxyEvent.MOVE_FURNITURE,
  ProxyEvent.DELETE_ROOM,
];
