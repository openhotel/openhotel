import { FurnitureType } from "../enums/main.ts";
import { Point, Point3d } from "@shared/types/point.types.ts";
import { CrossDirectionKeys } from "@shared/types/direction.types.ts";
import { Size3d } from "@shared/types/size.types.ts";
import { CrossDirection } from "@shared/enums/direction.enums.ts";

export type FurnitureDirectionTexture = {
  texture: string;
  pivot?: Point;
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
  framePosition?: Point;
  state?: string;
  forSale?: {
    price: number;
  };
} & Furniture;
