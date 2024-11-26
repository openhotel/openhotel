import { Point3d } from "shared/types";
import { Direction, Hemisphere } from "shared/enums";

export type User = {
  accountId: string;
  username: string;
  roomId: string;
  position: Point3d;
  positionUpdatedAt: number;
  bodyDirection: Direction;
  skinColor: number;
};

export type CurrentUser = {
  apiToken: string;
  hemisphere: Hemisphere;
} & User;
