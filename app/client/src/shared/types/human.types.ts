import { DirectionKeys } from "./direction.types";
import { Point2d } from "./point.types";

type HumanDirectionArm = {
  visible: boolean;
  zIndex: number;
  pivot: Point2d;
};

export type HumanDirectionData = {
  pivot: Point2d;
  xScale?: number;
  head: {
    pivot: Point2d;
  };
  rightArm: HumanDirectionArm;
  leftArm: HumanDirectionArm;
  directionInitials?: string;
};

export type HumanData = Record<DirectionKeys, HumanDirectionData>;
