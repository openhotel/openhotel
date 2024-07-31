import {
  container,
  ContainerComponent,
  DisplayObjectEvent,
  EventMode,
  sprite,
} from "@tulib/tulip";
import { SpriteSheetEnum } from "shared/enums";

type Props = {
  axis: "x" | "z";
  height: number;
  tint: number;
};

export const wallComponent: ContainerComponent<Props> = (props) => {
  const $container = container<Props>(props);

  const { axis, height, tint } = $container.getProps();

  const top = sprite({
    spriteSheet: SpriteSheetEnum.ROOM,
    texture: `wall-${axis}-top`,
    eventMode: EventMode.NONE,
    tint,
    pivot: { x: 0, y: 0 },
  });
  top.on(DisplayObjectEvent.LOADED, () => {
    const topHeight = top.getBounds().height;
    const $wallHeight = height - topHeight + 2;

    const mid = sprite({
      spriteSheet: SpriteSheetEnum.ROOM,
      texture: `wall-${axis}-mid`,
      eventMode: EventMode.NONE,
      tint,
      pivot: { x: 0, y: -topHeight },
    });
    mid.on(DisplayObjectEvent.LOADED, () => {
      mid.getDisplayObject({ __preventWarning: true }).bounds.maxY =
        $wallHeight;

      const bottom = sprite({
        spriteSheet: SpriteSheetEnum.ROOM,
        texture: `wall-${axis}-bottom`,
        eventMode: EventMode.NONE,
        tint,
        pivot: { x: 0, y: -topHeight - $wallHeight },
      });
      $container.add(bottom);
    });
    $container.add(mid);
  });

  $container.add(top);

  return $container.getComponent(wallComponent);
};
