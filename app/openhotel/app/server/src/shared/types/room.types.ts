import { RoomPoint } from "shared/types/rooms/main.ts";
import { Point3d } from "@shared/types/point.types.ts";
import { Direction } from "@shared/enums/direction.enums.ts";

export type RoomLayout = {
  id: number;
  layout: RoomPoint[][];
  spawnPoint: Point3d;
  spawnDirection: Direction;
};
