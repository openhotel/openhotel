import { FurniturePosition } from "@shared/types/furniture.types.ts";
import { SpriteSheetPoint } from "@shared/types/sprite-sheet.types.ts";

export const getPositionFromIsometricPosition = ({
  x,
  z,
}: Partial<FurniturePosition>): SpriteSheetPoint => ({
  x: 24 * x - 24 * z,
  y: 12 * x + 12 * z,
});
