import { ContainerComponent, sprite } from "@tu/tulip";
import { SpriteSheetEnum } from "shared/enums";
import { baseIconComponent } from "./base-icon.component";

type Props = {};

export const clubIconComponent: ContainerComponent<Props> = ({ ...props }) => {
  const $container = baseIconComponent({
    ...props,
    size: 23,
  });

  const icon = sprite({
    spriteSheet: SpriteSheetEnum.UI,
    texture: "club",
    position: {
      x: 0,
      y: 1,
    },
  });
  $container.add(icon);

  return $container.getComponent(clubIconComponent);
};
