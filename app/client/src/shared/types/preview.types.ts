import { SpriteSheetEnum } from "../enums";

export type PreviewAction = {
  name: string;
  icon?: unknown;
  action: () => void;
};

export type PreviewTypes = "furniture" | "human";

export type Preview = {
  type: PreviewTypes;
  texture: string;
  name: string;
  spriteSheet?: SpriteSheetEnum;
};
