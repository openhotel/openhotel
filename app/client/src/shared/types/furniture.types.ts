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

export type FurnitureDirectionData = {
  textures: FurnitureDirectionTexture[];
};

export type FurnitureDirectionDataMap = Record<
  Partial<CrossDirection>,
  FurnitureDirectionData
>;

export type FurnitureData = {
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
};

export type BaseFurniture = {
  id: string;
  furnitureId: string;
  position: Point3d;
  direction: CrossDirection;
  size: Size3d;
};

export type RoomFurnitureBase = {
  type: FurnitureType.FURNITURE;
} & BaseFurniture;

export type RoomFurnitureFrame = {
  type: FurnitureType.FRAME;
  framePosition: Point2d;
} & BaseFurniture;

export type RoomFurniture = RoomFurnitureFrame | RoomFurnitureBase;
