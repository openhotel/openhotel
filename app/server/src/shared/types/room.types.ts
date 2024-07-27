import { User } from "./user.types.ts";
import { Point } from "shared/types/main.ts";
import { RoomPointEnum } from "shared/enums/main.ts";

export type RoomUser = {
  user: User;
  position: Point;
  joinedAt: number;
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

export type RoomPoint = number | RoomPointEnum;
