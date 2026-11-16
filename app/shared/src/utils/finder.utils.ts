import { Grid } from "@shared/types/grid.types.ts";
import { Point } from "@shared/types/point.types.ts";
import { NOT_REACHED_COST } from "@shared/consts/finder.consts.ts";

// Distance to the end point, from A*
export const getTravelHeuristic = (
  grid: Grid,
  endPoint: Point,
): Float32Array => {
  const { width, height } = grid;
  const travelHeuristic = new Float32Array(width * height);
  travelHeuristic.fill(NOT_REACHED_COST);

  for (let y = 0; y < height; y++) {
    const dy = y - endPoint.y;
    const dy2 = dy * dy;
    const row = y * height;
    for (let x = 0; x < width; x++) {
      const dx = x - endPoint.x;
      travelHeuristic[row + x] = Math.sqrt(dx * dx + dy2);
    }
  }
  return travelHeuristic;
};

export const isTilePoint = (point: Point): boolean =>
  Number.isInteger(point.x) && Number.isInteger(point.y);
