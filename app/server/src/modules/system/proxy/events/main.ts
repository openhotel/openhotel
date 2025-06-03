import { ProxyEventType } from "shared/types/event.types.ts";
import { joinRoomEvent } from "./join-room.event.ts";
import { pointerTileEvent } from "./pointer-tile.event.ts";
import { messageEvent } from "./message.event.ts";
import { typingStartEvent } from "./typing-start.event.ts";
import { typingEndEvent } from "./typing-end.event.ts";
import { preJoinRoomEvent } from "./pre-join-room.event.ts";
import { placeItemEvent } from "./place-item.event.ts";
import { rotateFurnitureEvent } from "./rotate-furniture.event.ts";
import { pickUpFurnitureEvent } from "./pick-up-furniture.event.ts";
import { moveFurnitureEvent } from "./move-furniture.event.ts";
import { deleteRoomEvent } from "./delete-room.event.ts";
export * from "./internal/main.ts";

export const eventList: ProxyEventType[] = [
  preJoinRoomEvent,
  joinRoomEvent,
  deleteRoomEvent,

  pointerTileEvent,

  placeItemEvent,

  messageEvent,

  typingStartEvent,
  typingEndEvent,

  rotateFurnitureEvent,
  pickUpFurnitureEvent,
  moveFurnitureEvent,
];
