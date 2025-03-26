import { RoomPointEnum } from "shared/enums";
import { Point3d } from "./point.types";
import { RoomFurniture } from "shared/types/furniture.types";
import { User } from "shared/types/user.types";

export type RoomPoint = string | RoomPointEnum;

export type BaseRoom = {
  type: "public" | "private";

  version: number;
  id: string;

  title: string;
  description: string;

  layout: RoomPoint[][];
  spawnPoint: Point3d;
  users: User[];

  maxUsers: number;
};

export type PrivateRoom = BaseRoom & {
  ownerId: string;
  ownerUsername: string | null;

  furniture: RoomFurniture[];
};
