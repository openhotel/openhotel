import {
  Point2d,
  Point3d,
  CrossDirection,
  Size3d,
  CrossDirectionKeys,
} from "@oh/utils";
import { FurnitureType } from "../enums/main.ts";

export type FurnitureDirectionTexture = {
  texture: string;
  pivot?: Point2d;
  zIndex: number;
  hitArea: number[];
  actions?: Record<string, string>;
};

export type FurnitureAction = {
  id: string;
  label: string;
  states: string[];
  defaultState: string;
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
  };
  actions?: FurnitureAction[];
};

export type Furniture = {
  id: string;
  furnitureId: string;
  type: FurnitureType;
  marketplaceListingId?: string;
};

export type RoomFurniture = {
  position: Point3d;
  direction: CrossDirection;
  size?: Size3d;
  framePosition?: Point2d;
  state?: string;
} & Furniture;
