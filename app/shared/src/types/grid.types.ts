import { FindPathConfig } from "./finder.types.ts";
import { Point } from "./point.types.ts";

export type Grid = {
  readonly width: number;
  readonly height: number;

  getHeightAt: (point: Point) => number | null;
  distance: (a: Point, b: Point) => number;
  index: (point: Point) => number;
  inBounds: (point: Point) => boolean;
  isWalkable: (point: Point) => boolean;
  walkMatrix: (
    callback: (x: number, y: number, cost: number | null) => void,
  ) => void;
  mapMatrix: <T>(
    callback: (x: number, y: number, cost: number | null) => T,
  ) => T[][];
  findPath: (
    startPoint: Point,
    endPoint: Point,
    config?: FindPathConfig,
  ) => Point[];
};
