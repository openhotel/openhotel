import { RoomPoint } from "shared/types/rooms/main.ts";
import { Direction, Point3d } from "@oh/utils";

export type RoomLayout = {
  id: number;
  layout: RoomPoint[][];
  spawnPoint: Point3d;
  spawnDirection: Direction;
};
