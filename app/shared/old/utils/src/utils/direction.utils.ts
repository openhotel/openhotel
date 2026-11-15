import { Point3d } from "../types/main.ts";
import { CrossDirection, Direction } from "../enums/main.ts";

export const getDirection = (
  currentPoint: Point3d,
  targetPoint: Point3d,
): Direction => {
  const xDifference = currentPoint.x - targetPoint.x;
  const zDifference = currentPoint.z - targetPoint.z;

  if (xDifference < 0 && zDifference < 0) return Direction.NORTH_EAST;
  if (xDifference < 0 && zDifference > 0) return Direction.NORTH_WEST;
  if (xDifference > 0 && zDifference < 0) return Direction.SOUTH_EAST;
  if (xDifference > 0 && zDifference > 0) return Direction.SOUTH_WEST;
  if (xDifference < 0) return Direction.NORTH;
  if (xDifference > 0) return Direction.SOUTH;
  if (zDifference < 0) return Direction.EAST;
  if (zDifference > 0) return Direction.WEST;

  return Direction.NONE;
};

export const getPointFromDirection = (direction: Direction): Point3d => {
  switch (direction) {
    case Direction.NORTH:
      return { x: 1, y: 0, z: 0 };
    case Direction.SOUTH:
      return { x: -1, y: 0, z: 0 };
    case Direction.EAST:
      return { x: 0, y: 0, z: 1 };
    case Direction.WEST:
      return { x: 0, y: 0, z: -1 };
    case Direction.NORTH_EAST:
      return { x: 1, y: 0, z: 1 };
    case Direction.NORTH_WEST:
      return { x: 1, y: 0, z: -1 };
    case Direction.SOUTH_EAST:
      return { x: -1, y: 0, z: 1 };
    case Direction.SOUTH_WEST:
      return { x: -1, y: 0, z: -1 };
    case Direction.NONE:
    default:
      return { x: 0, y: 0, z: 0 };
  }
};

export const getPointFromCrossDirection = (
  direction: CrossDirection,
): Point3d => {
  switch (direction) {
    case CrossDirection.NORTH:
      return { x: 1, y: 0, z: 0 };
    case CrossDirection.SOUTH:
      return { x: -1, y: 0, z: 0 };
    case CrossDirection.EAST:
      return { x: 0, y: 0, z: 1 };
    case CrossDirection.WEST:
      return { x: 0, y: 0, z: -1 };
    default:
      return { x: 0, y: 0, z: 0 };
  }
};

export const getDirectionFromCrossDirection = (
  direction: CrossDirection,
): Direction => {
  switch (direction) {
    case CrossDirection.NORTH:
      return Direction.NORTH;
    case CrossDirection.SOUTH:
      return Direction.SOUTH;
    case CrossDirection.EAST:
      return Direction.EAST;
    case CrossDirection.WEST:
      return Direction.WEST;
  }
};

export const getCrossDirectionFromDirection = (
  direction: Direction,
): CrossDirection | null => {
  switch (direction) {
    case Direction.NORTH:
    case Direction.NORTH_EAST:
      return CrossDirection.NORTH;
    case Direction.SOUTH:
    case Direction.SOUTH_WEST:
      return CrossDirection.SOUTH;
    case Direction.EAST:
    case Direction.SOUTH_EAST:
      return CrossDirection.EAST;
    case Direction.WEST:
    case Direction.NORTH_WEST:
      return CrossDirection.WEST;
  }
  return null;
};
