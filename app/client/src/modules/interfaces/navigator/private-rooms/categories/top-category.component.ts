import { container, textSprite } from "@tu/tulip";
import { SpriteSheetEnum } from "shared/enums";

export const topCategoryComponent = () => {
  const $container = container({
    position: {
      x: 4,
      y: 19,
    },
  });

  const text = textSprite({
    spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
    text: "top",
    tint: 0,
  });
  $container.add(text);

  return $container.getComponent(topCategoryComponent);
};
