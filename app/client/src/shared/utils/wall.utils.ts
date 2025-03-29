import { Point2d } from "shared/types";

export const getWallIsometricPositionFromPosition = (
  position: Point2d,
): Point2d => ({
  x: Math.round(position.x / 2),
  y: Math.round(position.y - position.x / 2),
});

export const getWallPositionFromIsometricPosition = (
  position: Point2d,
): Point2d => ({
  x: 2 * position.x,
  y: -position.x - position.y,
});
