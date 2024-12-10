import { Point3d } from "@oh/utils";

export const isPointAdjacent = (
  currentPoint: Point3d,
  targetPoint: Point3d,
): boolean => {
  const xDifference = Math.abs(currentPoint.x - targetPoint.x);
  const zDifference = Math.abs(currentPoint.z - targetPoint.z);

  // Check if the points are adjacent either orthogonally or diagonally
  return xDifference <= 1 && zDifference <= 1 && xDifference + zDifference > 0;
};
