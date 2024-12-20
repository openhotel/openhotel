import { container, ContainerComponent, EventMode, sprite } from "@tu/tulip";
import { SpriteSheetEnum } from "shared/enums";

type Props = {
  axis: "x" | "z";
  height: number;
};

export const wallComponent: ContainerComponent<Props> = (props) => {
  const $container = container<Props>(props);

  const { axis, height } = $container.getProps();

  const top = sprite({
    spriteSheet: SpriteSheetEnum.ROOM,
    texture: `wall-${axis}-top`,
    eventMode: EventMode.NONE,
    pivot: { x: 0, y: 0 },
  });
  const topHeight = top.getBounds().height;
  const $wallHeight = height - topHeight + 2;

  const mid = sprite({
    spriteSheet: SpriteSheetEnum.ROOM,
    texture: `wall-${axis}-mid`,
    eventMode: EventMode.NONE,
    pivot: { x: 0, y: 0 },
    position: { x: 0, y: topHeight },
  });
  mid.getDisplayObject({ __preventWarning: true }).height = $wallHeight;

  const bottom = sprite({
    spriteSheet: SpriteSheetEnum.ROOM,
    texture: `wall-${axis}-bottom`,
    eventMode: EventMode.NONE,
    pivot: { x: 0, y: -topHeight - $wallHeight },
  });
  $container.add(top, mid, bottom);

  return $container.getComponent(wallComponent);
};
