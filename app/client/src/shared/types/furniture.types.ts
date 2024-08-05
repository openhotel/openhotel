import { Point2d, Point3d } from "./point.types";
import { Size, Size3d } from "./size.types";
import { CrossDirectionKeys } from "./direction.types";
import { CrossDirection } from "shared/enums";

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
  Partial<CrossDirectionKeys>,
  FurnitureDirectionData
>;

export type FurnitureData = {
  id: string;
  label: string;
  collection: string;
  spriteSheet: string;
  size: Size3d;
  direction: FurnitureDirectionDataMap;
};

export type BaseFurniture = {
  uid: string;
  id: string;
};

export type RoomFurniture = {
  position: Point3d;
  size: Size3d;
  direction: CrossDirection;
} & BaseFurniture;
