import { Room } from "./room.types";

export type LoadRoomEvent = {
  room: Room;
};

export type SystemMessageEvent = {
  message: string;
};
