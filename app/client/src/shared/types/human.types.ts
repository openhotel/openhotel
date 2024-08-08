import { DirectionKeys } from "./direction.types";
import { Point2d } from "./point.types";

export type HumanDirectionData = {
  pivot: Point2d;
  xScale?: number;
  head: {
    pivot: Point2d;
  };
  directionInitials?: string;
};

export type HumanData = Record<DirectionKeys, HumanDirectionData>;
