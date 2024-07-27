import { container, ContainerComponent, EventMode, sprite } from "@tulib/tulip";
import { SpriteSheetEnum } from "shared/enums";

type Props = {
  axis: "x" | "z";
  height: number;
  tint: number;
};

export const wallComponent: ContainerComponent<Props> = async (props) => {
  const $container = await container<Props>(props);

  const { axis, height, tint } = $container.getProps();

  const top = await sprite({
    spriteSheet: SpriteSheetEnum.ROOM,
    texture: `wall-${axis}-top`,
    eventMode: EventMode.NONE,
    tint,
    pivot: { x: 0, y: 0 },
  });
  const topHeight = top.getBounds().height;
  const $wallHeight = height - topHeight + 2;

  const mid = await sprite({
    spriteSheet: SpriteSheetEnum.ROOM,
    texture: `wall-${axis}-mid`,
    eventMode: EventMode.NONE,
    tint,
    pivot: { x: 0, y: -topHeight },
  });
  console.log($wallHeight);
  mid.getDisplayObject({ __preventWarning: true }).bounds.maxY = $wallHeight;

  const bottom = await sprite({
    spriteSheet: SpriteSheetEnum.ROOM,
    texture: `wall-${axis}-bottom`,
    eventMode: EventMode.NONE,
    tint,
    pivot: { x: 0, y: -topHeight - $wallHeight },
  });

  $container.add(top, mid, bottom);

  return $container.getComponent(wallComponent);
};
