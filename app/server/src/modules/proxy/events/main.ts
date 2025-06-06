import { ProxyEventType } from "shared/types/event.types.ts";
import { addRoomEvent } from "./add-room.event.ts";
import { disconnectUserEvent } from "./disconnect-user.event.ts";
import { removeRoomEvent } from "./remove-room.event.ts";
import { roomDataEvent } from "./room-data.event.ts";
import { updateEvent } from "./update.event.ts";
import { userDataEvent } from "./user-data.event.ts";
import { gameUserRequestEvent } from "modules/proxy/events/game-user-request.event.ts";

export const eventList: ProxyEventType[] = [
  addRoomEvent,
  disconnectUserEvent,
  removeRoomEvent,
  roomDataEvent,
  updateEvent,
  userDataEvent,
  gameUserRequestEvent,
];
