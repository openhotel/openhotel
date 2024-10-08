import { sprite, SpriteComponent } from "@tu/tulip";
import { TextureEnum } from "shared/enums";

export const logoComponent: SpriteComponent = () => {
  const $logo = sprite({
    texture: TextureEnum.LOGO_FULL,
  });
  return $logo.getComponent(logoComponent);
};
