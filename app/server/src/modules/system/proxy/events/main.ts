import { ProxyEventType } from "shared/types/event.types.ts";
import { joinRoomEvent } from "./join-room.event.ts";
import { pointerTileEvent } from "./pointer-tile.event.ts";
import { messageEvent } from "./message.event.ts";
import { typingStartEvent } from "./typing-start.event.ts";
import { typingEndEvent } from "./typing-end.event.ts";
import { preJoinRoomEvent } from "./pre-join-room.event.ts";
import { placeItemEvent } from "./place-item.event.ts";
export * from "./internal/main.ts";

export const eventList: ProxyEventType[] = [
  preJoinRoomEvent,
  joinRoomEvent,

  pointerTileEvent,

  placeItemEvent,

  messageEvent,

  typingStartEvent,
  typingEndEvent,
];
