import { Size2d } from "shared/types";

export const TILE_SIZE: Size2d = {
  width: 48,
  height: 24,
};

export const STEP_TILE_HEIGHT = 6;
export const STAIRS_HEIGHT = (STEP_TILE_HEIGHT + STEP_TILE_HEIGHT / 2) * 4;
export const TILE_WIDTH = 12;
export const TILE_Y_HEIGHT = STEP_TILE_HEIGHT * 4;
export const MOVEMENT_BETWEEN_TILES_DURATION = 504;
