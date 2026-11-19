import { Point3d } from "@shared/types/point.types.ts";
import { Direction } from "@shared/enums/direction.enums.ts";
import { RoomPoint } from "@shared/types/room.types.ts";

export type RoomLayout = {
  id: number;
  layout: RoomPoint[][];
  spawnPoint: Point3d;
  spawnDirection: Direction;
};
