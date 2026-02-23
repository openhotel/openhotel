import {
  FurnitureDirection,
  FurnitureType,
} from "shared/enums/furniture.enum.ts";

export type FurnitureBounds = {
  width: number;
  height: number;
  depth: number;
};

export type FurniturePivot = {
  x: number;
  y: number;
};

export type FurnitureIcon = {
  texture: string;
};

export type FurnitureTexture = {
  texture: string;
  pivot: FurniturePivot;
  zIndex: number;

  actions?: Record<string, string>;
};

export type furnitureDirectionItem = {
  textures: FurnitureTexture[];
};

export type FurnitureAction = {
  id: string;
  label: string;
  states: string[];
  defaultState: string;
};

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
