import { FurnitureData, FurnitureDirectionData } from "shared/types";
import { CrossDirection, SpriteSheetEnum } from "shared/enums";

const DUMMY_FURNITURE_DIRECTION: FurnitureDirectionData = {
  textures: [
    {
      texture: "box",
      bounds: {
        width: 48,
        height: 50,
      },
      pivot: {
        x: 0,
        y: 12,
      },
      zIndex: 0,
    },
  ],
};

export const DUMMY_FURNITURE_DATA: FurnitureData = {
  furnitureId: "dummy",
  icon: null,
  direction: {
    [CrossDirection.NORTH]: DUMMY_FURNITURE_DIRECTION,
    [CrossDirection.EAST]: DUMMY_FURNITURE_DIRECTION,
    [CrossDirection.SOUTH]: DUMMY_FURNITURE_DIRECTION,
    [CrossDirection.WEST]: DUMMY_FURNITURE_DIRECTION,
  },
  description: "",
  label: "",
  size: {
    width: 1,
    depth: 1,
    height: 27,
  },
  spriteSheet: SpriteSheetEnum.FURNITURE_DUMMY,
};

const DUMMY_FURNITURE_FRAME_DIRECTION_NORTH: FurnitureDirectionData = {
  textures: [
    {
      texture: "frame-north",
      bounds: {
        width: 24,
        height: 38,
      },
      pivot: {
        x: 0,
        y: 0,
      },
      zIndex: 0,
      hitArea: [0, 12, 24, 0, 24, 27, 0, 39],
    },
  ],
};
const DUMMY_FURNITURE_FRAME_DIRECTION_EAST: FurnitureDirectionData = {
  textures: [
    {
      texture: "frame-east",
      bounds: {
        width: 24,
        height: 38,
      },
      pivot: {
        x: 0,
        y: 0,
      },
      zIndex: 0,
      hitArea: [0, 0, 24, 12, 24, 39, 0, 27],
    },
  ],
};

export const DUMMY_FURNITURE_FRAME_DATA: FurnitureData = {
  furnitureId: "dummy",
  icon: null,
  direction: {
    [CrossDirection.NORTH]: DUMMY_FURNITURE_FRAME_DIRECTION_NORTH,
    [CrossDirection.EAST]: DUMMY_FURNITURE_FRAME_DIRECTION_EAST,
  } as any,
  size: {
    width: 12,
    depth: 0,
    height: 24,
  },
  description: "",
  label: "",
  spriteSheet: SpriteSheetEnum.FURNITURE_DUMMY,
};

export const FURNITURE_SAFE_TILE_MARGIN = 4;
