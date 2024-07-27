import { RoomPointEnum } from "shared/enums";
import { Point2d } from "./point.types";

export type RoomPoint = string | RoomPointEnum;

export type Room = {
  id: string;
  title: string;
  description: string;
  layout: RoomPoint[][];
  spawnPoint: Point2d;
};
