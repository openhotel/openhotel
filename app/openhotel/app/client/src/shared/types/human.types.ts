import { DirectionKeys } from "@shared/types/direction.types.ts";
import { Point } from "@shared/types/point.types.ts";

export type HumanDirectionData = {
  pivot: Point;
  xScale?: number;
  head: {
    pivot: Point;
  };
  directionInitials?: string;
};

export type HumanData = Record<DirectionKeys, HumanDirectionData>;
