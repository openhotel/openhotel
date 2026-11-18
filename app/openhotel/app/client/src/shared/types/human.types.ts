import { Point2d } from "./point.types";
import { DirectionKeys } from "@shared/types/direction.types.ts";

export type HumanDirectionData = {
  pivot: Point2d;
  xScale?: number;
  head: {
    pivot: Point2d;
  };
  directionInitials?: string;
};

export type HumanData = Record<DirectionKeys, HumanDirectionData>;
