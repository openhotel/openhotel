import { ContainerComponent, sprite } from "@tu/tulip";
import { SpriteSheetEnum } from "shared/enums";
import { baseIconComponent } from "./base-icon.component";

type Props = {};

export const catalogIconComponent: ContainerComponent<Props> = ({
  ...props
}) => {
  const $container = baseIconComponent({
    ...props,
    size: 23,
  });

  const icon = sprite({
    spriteSheet: SpriteSheetEnum.UI,
    texture: "catalog",
    position: {
      x: 3,
      y: 0,
    },
  });
  $container.add(icon);

  return $container.getComponent(catalogIconComponent);
};
