import { sprite, SpriteComponent } from "@tulib/tulip";

export const logoComponent: SpriteComponent = async () => {
  const $logo = await sprite({
    texture: "logo_full.png",
  });
  return $logo.getComponent(logoComponent);
};
