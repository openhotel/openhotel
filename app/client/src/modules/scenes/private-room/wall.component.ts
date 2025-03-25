import {
  container,
  ContainerComponent,
  Cursor,
  DisplayObjectEvent,
  EventMode,
  sprite
} from "@tu/tulip";
import { SpriteSheetEnum, SystemEvent, Event } from "shared/enums";
import { System } from "system";
import { Point3d } from "shared/types";

type Props = {
  axis: "x" | "z";
  height: number;
  point?: Point3d;
};

export const wallComponent: ContainerComponent<Props> = (props) => {
  const $container = container<Props>(props);

  const { axis, height, point } = $container.getProps();

  const top = sprite({
    spriteSheet: SpriteSheetEnum.ROOM,
    texture: `wall-${axis}-top`,
    eventMode: point ? EventMode.STATIC : EventMode.NONE,
    cursor: point ? Cursor.POINTER : undefined,
    pivot: { x: 0, y: 0 },
  });
  const topHeight = top.getBounds().height;
  const $wallHeight = height - topHeight + 2;

  const mid = sprite({
    spriteSheet: SpriteSheetEnum.ROOM,
    texture: `wall-${axis}-mid`,
    eventMode: point ? EventMode.STATIC : EventMode.NONE,
    cursor: point ? Cursor.POINTER : undefined,
    pivot: { x: 0, y: 0 },
    position: { x: 0, y: topHeight },
  });
  mid.getDisplayObject({ __preventWarning: true }).height = $wallHeight;

  const bottom = sprite({
    spriteSheet: SpriteSheetEnum.ROOM,
    texture: `wall-${axis}-bottom`,
    eventMode: point ? EventMode.STATIC : EventMode.NONE,
    cursor: point ? Cursor.POINTER : undefined,
    pivot: { x: 0, y: -topHeight - $wallHeight },
  });
  
  if (point) {
    [top, mid, bottom].forEach(sprite => {
      sprite.on(DisplayObjectEvent.POINTER_ENTER, () => {
        System.events.emit(SystemEvent.CURSOR_COORDS, {
          position: point,
        });
      });
      
      sprite.on(DisplayObjectEvent.POINTER_TAP, (event: MouseEvent) => {
        System.proxy.emit(Event.POINTER_TILE, {
          position: {
            x: point.x,
            z: point.z,
          },
        });
      });
    });
  }
  
  $container.add(top, mid, bottom);

  return $container.getComponent(wallComponent);
};
