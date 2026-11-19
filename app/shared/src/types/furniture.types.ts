import {
  FurnitureDirection,
  FurnitureType,
} from "@shared/enums/furniture.enum.ts";
import { Point } from "@shared/types/point.types.ts";

export type FurnitureDataFileBounds = {
  width: number;
  height: number;
};

export type FurnitureDirectionTexture = {
  texture: string;
  pivot?: Point;
  zIndex: number;
  hitArea: number[];
  actions?: Record<string, string>;
};

export type FurnitureDirectionData = {
  textures: FurnitureDirectionTexture[];
};

export type FurnitureDataFileTexture = {
  texture: string;
  pivot?: { x: number; y: number };
  position?: { x: number; z: number };
  zIndex?: number;
  bounds?: FurnitureDataFileBounds;
  actions?: Record<string, string>;
};

export type FurnitureDataFileAction = {
  id: string;
  label: string;
  states: string[];
  defaultState: string;
};

export type FurnitureDataFile = {
  id: string;
  type: string;
  revision: string;
  icon: {
    texture: string;
    bounds?: FurnitureDataFileBounds;
  };
  size: { width: number; height: number; depth: number };
  direction: Partial<Record<string, { textures: FurnitureDataFileTexture[] }>>;
  actions?: FurnitureDataFileAction[];
};

export type FurnitureSheetFileFrame = {
  frame: { x: number; y: number; w: number; h: number };
  sourceSize?: { w: number; h: number };
  spriteSourceSize?: { x: number; y: number; w: number; h: number };
  anchor?: { x: number; y: number };
  rotated?: boolean;
  trimmed?: boolean;
  __key?: string;
};

export type FurnitureSheetFile = {
  frames: Record<string, FurnitureSheetFileFrame>;
  animations?: Record<string, string[]>;
  meta: {
    image: string;
    size: { w: number; h: number };
    format?: string;
    scale?: string | number;
  };
};

export type FurnitureLangItem = {
  name: string;
  description: string;
};

export type FurnitureLang = Record<string, FurnitureLangItem>;

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

// @ignore-duplicate
export type FurnitureData = {
  version: 1;
  id: string;

  bounds?: FurnitureBounds;
  type?: FurnitureType;

  actions?: FurnitureAction[];

  icon?: FurnitureIcon;
  direction?: Partial<Record<FurnitureDirection, furnitureDirectionItem>>;
};

export type FurnitureSize = {
  width: number;
  height: number;
  depth: number;
};

export type FurniturePosition = {
  x: number;
  z: number;
};

export type FurnitureDirectionItem = {
  textures: FurnitureTexture[];
};
