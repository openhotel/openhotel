import { RoomPointEnum } from "shared/enums";
import { Point3d } from "./point.types";
import { RoomFurniture } from "shared/types/furniture.types";

export type RoomPoint = string | RoomPointEnum;

export type Room = {
  version: number;
  id: string;

  title: string;
  description: string;

  ownerId: string;
  ownerUsername: string | null;

  layout: RoomPoint[][];
  furniture: RoomFurniture[];
  spawnPoint: Point3d;
};
