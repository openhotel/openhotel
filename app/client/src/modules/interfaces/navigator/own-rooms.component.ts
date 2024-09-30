import { container, ContainerComponent, textSprite } from "@tu/tulip";
import { SpriteSheetEnum } from "shared/enums";

export const ownRoomsComponent: ContainerComponent = (props) => {
  const $container = container(props);

  const $text = textSprite({
    text: `OWN`,
    spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
    color: 0,
    position: {
      x: 0,
      y: 0,
    },
  });
  $container.add($text);

  return $container.getComponent(ownRoomsComponent);
};
