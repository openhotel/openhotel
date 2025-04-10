import { Sides } from "@oh/pixi-components";

export const TEXT_PADDING: Partial<Sides> = {
  right: 6,
  left: 6,
  top: 3,
  bottom: 1,
};

export const TEXT_BACKGROUND_BASE = {
  backgroundColor: 0,
  backgroundAlpha: 0.25,
  color: 0xffffff,
  padding: TEXT_PADDING,
};
