import { ProxyEventType } from "shared/types/event.types.ts";
import { joinRoomEvent } from "./join-room.event.ts";
import { testEvent } from "./test.event.ts";
import { pointerTileEvent } from "./pointer-tile.event.ts";
import { messageEvent } from "./message.event.ts";
import { typingStartEvent } from "./typing-start.event.ts";
import { typingEndEvent } from "./typing-end.event.ts";

export * from "./joined.event.ts";
export * from "./left.event.ts";

export const eventList: ProxyEventType[] = [
  joinRoomEvent,
  testEvent,
  pointerTileEvent,
  messageEvent,

  typingStartEvent,
  typingEndEvent,
];
