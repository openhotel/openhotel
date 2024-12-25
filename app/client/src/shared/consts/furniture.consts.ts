import { FurnitureData, FurnitureDirectionData } from "shared/types";
import { CrossDirection, SpriteSheetEnum } from "shared/enums";

const DUMMY_FURNITURE_DIRECTION: FurnitureDirectionData = {
  textures: [
    {
      texture: "box",
      bounds: {
        width: 0,
        height: 0,
      },
      pivot: {
        x: -24,
        y: -38,
      },
      zIndex: 0,
      hitArea: [],
    },
  ],
};

export const DUMMY_FURNITURE_DATA: FurnitureData = {
  furnitureId: "dummy",
  direction: {
    [CrossDirection.NORTH]: DUMMY_FURNITURE_DIRECTION,
    [CrossDirection.EAST]: DUMMY_FURNITURE_DIRECTION,
    [CrossDirection.SOUTH]: DUMMY_FURNITURE_DIRECTION,
    [CrossDirection.WEST]: DUMMY_FURNITURE_DIRECTION,
  },
  description: "",
  label: "",
  spriteSheet: SpriteSheetEnum.FURNITURE_DUMMY,
};

const DUMMY_FURNITURE_FRAME_DIRECTION_NORTH: FurnitureDirectionData = {
  textures: [
    {
      texture: "frame-north",
      bounds: {
        width: 0,
        height: 0,
      },
      pivot: {
        x: -12,
        y: -19,
      },
      zIndex: 0,
      hitArea: [],
    },
  ],
};
const DUMMY_FURNITURE_FRAME_DIRECTION_EAST: FurnitureDirectionData = {
  textures: [
    {
      texture: "frame-east",
      bounds: {
        width: 0,
        height: 0,
      },
      pivot: {
        x: -12,
        y: -19,
      },
      zIndex: 0,
      hitArea: [],
    },
  ],
};

export const DUMMY_FURNITURE_FRAME_DATA: FurnitureData = {
  furnitureId: "dummy",
  direction: {
    [CrossDirection.NORTH]: DUMMY_FURNITURE_FRAME_DIRECTION_NORTH,
    [CrossDirection.EAST]: DUMMY_FURNITURE_FRAME_DIRECTION_EAST,
    [CrossDirection.SOUTH]: DUMMY_FURNITURE_FRAME_DIRECTION_NORTH,
    [CrossDirection.WEST]: DUMMY_FURNITURE_FRAME_DIRECTION_EAST,
  },
  description: "",
  label: "",
  spriteSheet: SpriteSheetEnum.FURNITURE_DUMMY,
};
