import { CrossDirection } from "@shared/enums/direction.enums.ts";
import { Point } from "@shared/types/point.types.ts";

export const getWallIsometricPositionFromPosition = (
  position: Point,
  direction: CrossDirection.NORTH | CrossDirection.EAST | "corner",
): Point => ({
  x: Math.round(position.x / 2),
  y: Math.round(
    direction === CrossDirection.NORTH
      ? position.y - position.x / 2
      : position.y + position.x / 2,
  ),
});

export const getWallPositionFromIsometricPosition = (
  position: Point,
  direction: CrossDirection,
): Point => ({
  x: direction === CrossDirection.NORTH ? -2 * position.x : 2 * position.x,
  y:
    direction === CrossDirection.NORTH
      ? position.x - position.y
      : -position.x - position.y,
});
