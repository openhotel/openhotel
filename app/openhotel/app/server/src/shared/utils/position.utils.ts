import { Point3d, Point2d } from "@oh/utils";
import { TILE_WIDTH } from "../consts/main.ts";

export const isPointAdjacent = (
  currentPoint: Point3d,
  targetPoint: Point3d,
): boolean => {
  const xDifference = Math.abs(currentPoint.x - targetPoint.x);
  const zDifference = Math.abs(currentPoint.z - targetPoint.z);

  // Check if the points are adjacent either orthogonally or diagonally
  return xDifference <= 1 && zDifference <= 1 && xDifference + zDifference > 0;
};

export const getPositionFromIsometricPosition = ({ x, y, z }): Point2d => ({
  x: (x * TILE_WIDTH - z * TILE_WIDTH) * 2,
  y: z * TILE_WIDTH + x * TILE_WIDTH - y,
});
