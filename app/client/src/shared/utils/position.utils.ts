import { Point2d, Point3d } from "shared/types";
import { TILE_WIDTH, TILE_Y_HEIGHT } from "shared/consts";

export const getPositionFromIsometricPosition = (
  { x, y, z },
  heightCorrection: boolean = true,
): Point2d => ({
  x: (x * TILE_WIDTH - z * TILE_WIDTH) * 2,
  y:
    z * TILE_WIDTH +
    x * TILE_WIDTH -
    y * (heightCorrection ? TILE_Y_HEIGHT : 1),
});

export const getIsometricPositionFromPosition = ({
  x,
  y,
}: Point2d): Point3d => {
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
