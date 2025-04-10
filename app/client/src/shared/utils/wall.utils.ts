import { Point2d } from "shared/types";
import { CrossDirection } from "shared/enums";

export const getWallIsometricPositionFromPosition = (
  position: Point2d,
  direction: CrossDirection.NORTH | CrossDirection.EAST | "corner",
): Point2d => ({
  x: Math.round(position.x / 2),
  y: Math.round(
    direction === CrossDirection.NORTH
      ? position.y - position.x / 2
      : position.y + position.x / 2,
  ),
});

export const getWallPositionFromIsometricPosition = (
  position: Point2d,
  direction: CrossDirection,
): Point2d => ({
  x: direction === CrossDirection.NORTH ? -2 * position.x : 2 * position.x,
  y:
    direction === CrossDirection.NORTH
      ? position.x - position.y
      : -position.x - position.y,
});
