import { FurnitureDirection, FurnitureType } from "shared/enums";

export type FurnitureBounds = {
  width: number;
  height: number;
};

export type FurnitureSize = {
  width: number;
  height: number;
  depth: number;
};

export type FurniturePivot = {
  x: number;
  y: number;
};

export type FurniturePosition = {
  x: number;
  z: number;
};

export type FurnitureIcon = {
  texture: string;
  bounds: FurnitureBounds;
};

export type FurnitureTexture = {
  texture: string;
  bounds: FurnitureBounds;
  pivot: FurniturePivot;
  position: FurniturePosition;
  zIndex: number;
};

export type FurnitureDirectionItem = {
  textures: FurnitureTexture[];
  stateTextures?: Record<string, Record<string, FurnitureTexture>>;
};

export type FurnitureAction = {
  id: string;
  label: string;
  states: string[];
  defaultState: string;
};

export type FurnitureData = {
  revision: string;
  id: string;

  size?: FurnitureSize;
  type?: FurnitureType;

  actions?: FurnitureAction[];

  icon?: FurnitureIcon;
  direction?: Partial<Record<FurnitureDirection, FurnitureDirectionItem>>;
};

//
export type FurnitureLangItem = {
  label: string;
  description: string;
};
export type FurnitureLang = Record<string, FurnitureLangItem>;
