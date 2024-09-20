import { container, EventMode, nineSliceSprite, textSprite } from "@tu/tulip";
import { SpriteSheetEnum } from "shared/enums";

export const topCategoryComponent = () => {
  const $container = container();
  const $content = container({
    position: {
      x: 6,
      y: 7,
    },
  });

  const $backgroundModal = nineSliceSprite({
    spriteSheet: SpriteSheetEnum.UI,
    texture: "modal-2",
    leftWidth: 6,
    topHeight: 6,
    rightWidth: 6,
    bottomHeight: 6,
    width: 201,
    height: 190,
    eventMode: EventMode.STATIC,
  });
  $container.add($backgroundModal, $content);

  const text = textSprite({
    spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
    text: "top",
    tint: 0,
  });
  $content.add(text);

  return $container.getComponent(topCategoryComponent);
};