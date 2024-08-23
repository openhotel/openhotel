export type SpriteSheetSize = {
  w: number;
  h: number;
};

type SpriteSheetPoint = {
  x: number;
  y: number;
};

export type SpriteSheetRectangle = SpriteSheetPoint & SpriteSheetSize;

export type SpriteSheetFrame = {
  frame: SpriteSheetRectangle;
  sourceSize: SpriteSheetSize;
  anchor: SpriteSheetPoint;
};

export type SpriteSheetMeta = {
  format: string;
  image: string;
  size: SpriteSheetSize;
  scale: number;
};

export type SpriteSheet = {
  frames: Record<string, SpriteSheetFrame>;
  animations: Record<string, string[]>;
  meta: SpriteSheetMeta;
};
