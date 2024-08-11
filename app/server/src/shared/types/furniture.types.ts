import { Point2d, Point3d } from "./point.types.ts";
import { CrossDirection, FurnitureType } from "../enums/main.ts";
import { Size3d } from "./size.types.ts";
import { CrossDirectionKeys } from "./direction.types.ts";

export type FurnitureDirectionTexture = {
  texture: string;
  bounds: Size3d;
  pivot?: Point2d;
  zIndex: number;
  hitArea: number[];
};

export type FurnitureDirectionData = {
  textures: FurnitureDirectionTexture[];
};

export type FurnitureDirectionDataMap = Record<
  Partial<CrossDirectionKeys>,
  FurnitureDirectionData
>;

export type FurnitureData = {
  id: string;
  type: FurnitureType;
  label: string;
  description: string;
  size?: Size3d;
  direction: FurnitureDirectionDataMap;
};

export type Furniture = {
  uid: string;
  id: string;
};

export type RoomFurniture = {
  position: Point3d;
  direction: CrossDirection;
  type: FurnitureType;
  size?: Size3d;
  framePosition?: Point2d;
} & Furniture;
