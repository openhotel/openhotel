import { animatedSprite, ContainerComponent, PlayStatus } from "@tu/tulip";
import { SpriteSheetEnum } from "shared/enums";

export const loaderComponent: ContainerComponent = (props) => {
  const $spinner = animatedSprite({
    spriteSheet: SpriteSheetEnum.SPINNER,
    animation: "spin",
    pivot: {
      x: 6,
      y: 6,
    },
    zIndex: 1_000,
    speed: 0.15,
    ...props,
  });

  $spinner.setPlayStatus(PlayStatus.PLAY);

  return $spinner.getComponent(loaderComponent);
};
