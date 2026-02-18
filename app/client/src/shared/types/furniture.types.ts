import { Point2d, Point3d } from "./point.types";
import { Size2d, Size3d } from "./size.types";
import { CrossDirection, FurnitureType } from "shared/enums";

export type FurnitureDirectionTexture = {
  texture: string;
  bounds: Size2d;
  pivot: Point2d;
  zIndex: number;
  hitArea?: number[];
};

export type FurnitureAction = {
  id: string;
  label: string;
  states: string[];
  defaultState: string;
};

export type FurnitureDirectionData = {
  textures: FurnitureDirectionTexture[];
  stateTextures: Record<string, Record<string, FurnitureDirectionTexture>>;
};

export type FurnitureDirectionDataMap = Record<
  Partial<CrossDirection>,
  FurnitureDirectionData
>;

export type FurnitureData = {
  type: FurnitureType;
  furnitureId: string;
  label: string;
  description: string;
  spriteSheet: string;
  direction: FurnitureDirectionDataMap;
  icon: {
    texture: string;
    bounds: Size2d;
  };
  size: Size3d;
  actions?: FurnitureAction[];
};

export type BaseFurniture = {
  id: string;
  furnitureId: string;
  position: Point3d;
  direction: CrossDirection;
  size: Size3d;
  state?: string;
};

export type RoomFurnitureBase = {
  type: FurnitureType.FURNITURE;
} & BaseFurniture;

export type RoomFurnitureFrame = {
  type: FurnitureType.FRAME;
  framePosition: Point2d;
} & BaseFurniture;

export type RoomFurniture = RoomFurnitureFrame | RoomFurnitureBase;

export type InventoryFurniture = {
  furnitureId: string;
  type: FurnitureType;
  ids: string[];
  marketplaceListingIds?: Record<string, string>;
};
