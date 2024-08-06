import { Point2d, Point3d } from "./point.types.ts";
import { CrossDirection, FurnitureType } from "../enums/main.ts";
import { Size3d } from "./size.types.ts";

export type FurnitureData = {
  id: string;
  label: string;
  type: FurnitureType;
  size: Size3d;
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
