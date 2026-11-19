import { SAFE_TILE_ZINDEX_MULTI } from "shared/consts";
import { TILE_WIDTH, TILE_Y_HEIGHT } from "@shared/consts/tiles.consts.ts";
import { Point, Point3d } from "@shared/types/point.types.ts";

export const getPositionFromIsometricPosition = (
  { x, y, z },
  heightCorrection: boolean = true,
): Point => ({
  x: (x * TILE_WIDTH - z * TILE_WIDTH) * 2,
  y:
    z * TILE_WIDTH +
    x * TILE_WIDTH -
    y * (heightCorrection ? TILE_Y_HEIGHT : 1),
});

export const getIsometricPositionFromPosition = ({ x, y }: Point): Point3d => {
  const originalY = 0;
  const calculatedX = (x / 2 + y - 2 * originalY) / (2 * TILE_WIDTH);
  const calculatedZ = (y + 2 * originalY - x / 2) / (2 * TILE_WIDTH);
  return {
    x: calculatedX,
    y: originalY,
    z: calculatedZ,
  };
};

export const isPosition3dEqual = (
  { x: x1, z: z1 }: Pick<Point3d, "x" | "z">,
  { x: x2, z: z2 }: Pick<Point3d, "x" | "z">,
) => x1 === x2 && z1 === z2;

export const isPosition2dEqual = (
  { x: x1, y: y1 }: Point,
  { x: x2, y: y2 }: Point,
) => x1 === x2 && y1 === y2;

export const getZIndex = (position: Point3d, extra: number = 0): number =>
  (position.x + position.z) * SAFE_TILE_ZINDEX_MULTI + position.y + extra;
