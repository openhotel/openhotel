import { Point3d } from "shared/types";
import { Direction } from "shared/enums";

export const getDirection = (
  currentPoint: Point3d,
  targetPoint: Point3d,
): Direction => {
  const xDifference = currentPoint.x - targetPoint.x;
  const zDifference = currentPoint.z - targetPoint.z;

  if (xDifference > 0 && zDifference > 0) return Direction.NORTH_EAST;
  if (xDifference > 0 && zDifference < 0) return Direction.NORTH_WEST;
  if (xDifference < 0 && zDifference > 0) return Direction.SOUTH_EAST;
  if (xDifference < 0 && zDifference < 0) return Direction.SOUTH_WEST;
  if (xDifference > 0) return Direction.NORTH;
  if (xDifference < 0) return Direction.SOUTH;
  if (zDifference > 0) return Direction.EAST;
  if (zDifference < 0) return Direction.WEST;

  return Direction.NONE;
};
