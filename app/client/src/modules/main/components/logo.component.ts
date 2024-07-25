import { sprite, SpriteComponent } from "@tulib/tulip";
import { TextureEnum } from "shared/enums/texture.enum";

export const logoComponent: SpriteComponent = async () => {
  const $logo = await sprite({
    texture: TextureEnum.LOGO_FULL,
  });
  return $logo.getComponent(logoComponent);
};
