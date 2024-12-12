import { Point3d } from "shared/types";
import { Direction, CrossDirection } from "shared/enums";

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

export const isDirectionToFront = (direction: Direction): boolean =>
  [Direction.NORTH, Direction.NORTH_EAST, Direction.EAST].includes(direction);

export const getDirectionInitials = (direction: Direction): string => {
  switch (direction) {
    case Direction.NORTH:
      return "n";
    case Direction.NORTH_EAST:
      return "ne";
    case Direction.EAST:
      return "e";
    case Direction.SOUTH_EAST:
      return "se";
    case Direction.SOUTH:
      return "s";
    case Direction.SOUTH_WEST:
      return "sw";
    case Direction.WEST:
      return "w";
    case Direction.NORTH_WEST:
      return "nw";
    default:
      return "";
  }
};

export const getNextDirection = (
  direction: Direction,
  clockwise = true,
): Direction =>
  clockwise
    ? direction === Direction.NORTH_WEST
      ? Direction.NORTH
      : direction + 1
    : direction === Direction.NORTH
      ? Direction.NORTH_WEST
      : direction - 1;

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
