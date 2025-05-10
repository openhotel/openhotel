import { HowlOptions } from "howler";

export enum SoundsEnum {
  CLICK,
}

export const soundSources: Record<
  SoundsEnum,
  { src: string[]; options?: Partial<HowlOptions> }
> = {
  [SoundsEnum.CLICK]: {
    src: ["/sounds/click.mp3"],
    options: { volume: 0.5 },
  },
};
