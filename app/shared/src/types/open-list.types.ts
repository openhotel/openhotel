import { Point } from "@shared/types/point.types.ts";

export type OpenList = {
  push: (index: number, from: number, cost: number) => void;
  pop: () => number;
  isEmpty: () => boolean;
  getIndex: (node: number) => number;
  getCost: (node: number) => number;
  getPath: (node: number, startPoint: Point, height: number) => Point[];
};
