import { ContainerComponent, sprite } from "@tu/tulip";
import { SpriteSheetEnum } from "shared/enums";
import { baseIconComponent } from "./base-icon.component";

type Props = {};

export const boxIconComponent: ContainerComponent<Props> = ({ ...props }) => {
  const $container = baseIconComponent({
    ...props,
    size: 23,
  });

  const icon = sprite({
    spriteSheet: SpriteSheetEnum.UI,
    texture: "box",
    position: {
      x: 1,
      y: 2,
    },
  });
  $container.add(icon);

  return $container.getComponent(boxIconComponent);
};
