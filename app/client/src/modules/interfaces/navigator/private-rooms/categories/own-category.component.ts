import { container, textSprite } from "@tu/tulip";
import { SpriteSheetEnum } from "shared/enums";

export const ownCategoryComponent = () => {
  const $container = container({
    position: {
      x: 4,
      y: 19,
    },
  });

  const text = textSprite({
    spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
    text: "my own",
    tint: 0,
  });
  $container.add(text);

  return $container.getComponent(ownCategoryComponent);
};
