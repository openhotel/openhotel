export type FurnitureDataFileBounds = {
  width: number;
  height: number;
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
