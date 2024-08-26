import {
  FurnitureActionType,
  FurnitureDirection,
  FurnitureType,
} from "shared/enums";

export type FurnitureSize = {
  width: number;
  height: number;
};

export type FurnitureBounds = {
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
  bounds: FurnitureSize;
};

export type FurnitureTexture = {
  texture: string;
  bounds: FurnitureSize;
  pivot: FurniturePivot;
  position: FurniturePosition;
  zIndex: number;
};

export type furnitureDirectionItem = {
  textures: FurnitureTexture[];
};

export type FurnitureSitAction = {
  type: FurnitureActionType.SIT;
};

export type FurnitureAction = FurnitureSitAction;

export type FurnitureData = {
  version: 1;
  id: string;

  bounds?: FurnitureBounds;
  type?: FurnitureType;

  actions?: FurnitureAction[];

  icon?: FurnitureIcon;
  direction?: Partial<Record<FurnitureDirection, furnitureDirectionItem>>;
};

//
export type FurnitureLangItem = {
  label: string;
  description: string;
};
export type FurnitureLang = Record<string, FurnitureLangItem>;
