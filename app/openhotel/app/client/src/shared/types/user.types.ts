import { CharacterBodyAnimation } from "shared/enums";
import { Direction } from "@shared/enums/direction.enums.ts";
import { Point3d } from "@shared/types/point.types.ts";

//@ignore-duplicate
export type User = {
  accountId: string;
  username: string;
  roomId: string;
  position: Point3d;
  targetPosition?: Point3d;
  positionUpdatedAt: number;
  bodyDirection: Direction;
  bodyAnimation: CharacterBodyAnimation;
  skinColor: number;
};
