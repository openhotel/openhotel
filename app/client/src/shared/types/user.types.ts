import { Point3d } from "shared/types";
import { Direction } from "shared/enums";

export type User = {
  id: string;
  username: string;
  roomId: string;
  position: Point3d;
  positionUpdatedAt: number;
  bodyDirection: Direction;
};
