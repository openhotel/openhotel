import { RoomPoint } from "../enums/room.enum.ts";
import { User } from "./user.types.ts";
import { Point } from "shared/types/main.ts";

export type RoomUser = {
  user: User;
  position: Point;
};

type BaseRoom = {
  id: string;
  title: string;
  description: string;
};

export type RawRoom = BaseRoom & {
  layout: string[];
};

export type Room = BaseRoom & {
  layout: RoomPoint[][];
  spawnPoint: Point;
};
