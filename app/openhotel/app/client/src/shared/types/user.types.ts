import { Point3d } from "shared/types";
import { CharacterBodyAnimation } from "shared/enums";
import { Direction } from "@shared/enums/direction.enums.ts";

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
