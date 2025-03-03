import {
  container,
  ContainerComponent,
  graphics,
  GraphicType,
} from "@tu/tulip";

type Props = {
  size: number;
};

export const baseIconComponent: ContainerComponent<Props> = ({
  size,
  ...props
}) => {
  const $container = container(props);

  const background = graphics({
    type: GraphicType.RECTANGLE,
    width: size,
    height: size,
    tint: 0x00ffff,
    alpha: 0,
  });
  $container.add(background);

  return $container.getComponent(baseIconComponent);
};
