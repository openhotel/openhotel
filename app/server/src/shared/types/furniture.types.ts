import {
  Point2d,
  Point3d,
  CrossDirection,
  Size3d,
  CrossDirectionKeys,
  Size2d,
} from "@oh/utils";
import { FurnitureType } from "../enums/main.ts";

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
  revision: string;
  id: string;

  type: FurnitureType;
  label: string;
  description: string;
  size?: Size3d;
  direction: FurnitureDirectionDataMap;
  icon: {
    texture: string;
    bounds: Size2d;
  };
};

export type Furniture = {
  id: string;
  furnitureId: string;
  type: FurnitureType;
};

export type RoomFurniture = {
  position: Point3d;
  direction: CrossDirection;
  size?: Size3d;
  framePosition?: Point2d;
} & Furniture;
