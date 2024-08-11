import { Point2d, Point3d } from "./point.types";
import { Size, Size3d } from "./size.types";
import { CrossDirection, FurnitureType } from "shared/enums";

export type FurnitureDirectionTexture = {
  texture: string;
  bounds: Size;
  pivot: Point2d;
  zIndex: number;
  hitArea: number[];
};

export type FurnitureDirectionData = {
  textures: FurnitureDirectionTexture[];
};

export type FurnitureDirectionDataMap = Record<
  Partial<CrossDirection>,
  FurnitureDirectionData
>;

export type FurnitureData = {
  id: string;
  type: FurnitureType;
  label: string;
  description: string;
  spriteSheet: string;
  size?: Size3d;
  direction: FurnitureDirectionDataMap;
};

export type BaseFurniture = {
  uid: string;
  id: string;
  position: Point3d;
  direction: CrossDirection;
};

export type RoomFurnitureBase = {
  type: FurnitureType.FURNITURE;
  size: Size3d;
} & BaseFurniture;

export type RoomFurnitureFrame = {
  type: FurnitureType.FRAME;
  framePosition: Point2d;
} & BaseFurniture;

export type RoomFurniture = RoomFurnitureFrame | RoomFurnitureBase;
