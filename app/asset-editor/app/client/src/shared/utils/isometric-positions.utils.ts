import { FurniturePosition, SpriteSheetPoint } from "shared/types";

export const getPositionFromIsometricPosition = ({
  x,
  z,
}: Partial<FurniturePosition>): SpriteSheetPoint => ({
  x: 24 * x - 24 * z,
  y: 12 * x + 12 * z,
});
