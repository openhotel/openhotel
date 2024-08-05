import { Point3d } from "./point.types.ts";
import { CrossDirection } from "../enums/main.ts";
import { Size3d } from "./size.types.ts";

export type FurnitureData = {
  id: string;
  label: string;
  size: Size3d;
};

export type Furniture = {
  uid: string;
  id: string;
};

export type RoomFurniture = {
  position: Point3d;
  size: Size3d;
  direction: CrossDirection;
} & Furniture;
