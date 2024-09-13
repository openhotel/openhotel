import { container, Cursor, EventMode, nineSliceSprite } from "@tu/tulip";
import { SpriteSheetEnum } from "shared/enums";

export const publicSpacesComponent = () => {
  const $container = container({
    position: {
      y: 21,
      x: 0,
    },
    cursor: Cursor.DEFAULT,
    eventMode: EventMode.STATIC,
    zIndex: 1,
  });

  const $backgroundModal = nineSliceSprite({
    spriteSheet: SpriteSheetEnum.UI,
    texture: "modal-2",
    leftWidth: 6,
    topHeight: 6,
    rightWidth: 6,
    bottomHeight: 6,
    width: 201,
    height: 205,
  });

  $container.add($backgroundModal);

  return $container.getComponent(publicSpacesComponent);
};
