import { Point, Point3d } from "@shared/types/point.types.ts";
import { CrossDirectionKeys } from "@shared/types/direction.types.ts";
import { Size3d } from "@shared/types/size.types.ts";
import { CrossDirection } from "@shared/enums/direction.enums.ts";
import { FurnitureType } from "@shared/enums/furniture.enum.ts";
import {
  FurnitureAction,
  FurnitureDirectionData,
} from "@shared/types/furniture.types.ts";

//@ignore-duplicate
export type FurnitureDirectionDataMap = Record<
  Partial<CrossDirectionKeys>,
  FurnitureDirectionData
>;

// @ignore-duplicate
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

// @ignore-duplicate
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
