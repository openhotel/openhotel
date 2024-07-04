import { sprite, AsyncComponent, SpriteMutable } from "@tulib/tulip";

export const logoComponent: AsyncComponent<{}, SpriteMutable> = async () => {
  const $logo = await sprite({
    texture: "logo_full.png",
  });
  return $logo.getComponent(logoComponent);
};
