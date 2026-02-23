import { FurnitureDirection, FurnitureType } from "shared/enums";

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
};

export type FurnitureTexture = {
  texture: string;
  pivot: FurniturePivot;
  position: FurniturePosition;
  zIndex: number;

  actions?: Record<string, string>;
};

export type FurnitureDirectionItem = {
  textures: FurnitureTexture[];
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

export type FurnitureLangItem = {
  name: string;
  description: string;
};
export type FurnitureLang = Record<string, FurnitureLangItem>;
