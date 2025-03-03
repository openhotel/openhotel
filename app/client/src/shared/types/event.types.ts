import { BaseRoom } from "./room.types";

export type LoadRoomEvent = {
  room: BaseRoom;
};

export type SystemMessageEvent = {
  message: string;
};
