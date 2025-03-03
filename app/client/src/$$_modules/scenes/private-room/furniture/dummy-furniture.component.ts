import {
  component,
  ContainerComponent,
  Cursor,
  DisplayObjectEvent,
  EventMode,
  sprite,
  SpriteMutable,
} from "@tu/tulip";
import { FurnitureDirectionData, Point3d } from "shared/types";
import { TILE_SIZE } from "shared/consts";
import { System } from "system";
import { Event, SystemEvent, CrossDirection } from "shared/enums";
import { getPositionFromIsometricPosition } from "shared/utils";
import { DUMMY_FURNITURE_DATA } from "shared/consts/furniture.consts";

type Props = {
  point: Point3d;
};

export type DummyFurnitureMutable = {
  getSpriteList: () => SpriteMutable[];
};

export const dummyFurnitureComponent: ContainerComponent<
  Props,
  DummyFurnitureMutable
> = (props) => {
  const $component = component<Props, DummyFurnitureMutable>(props);

  const $$destroy = $component.$destroy;
  const { point } = $component.getProps();

  const furnitureDirectionData = DUMMY_FURNITURE_DATA.direction[
    CrossDirection.NORTH
  ] as FurnitureDirectionData;

  const positionZIndex = point.x + point.z - point.y;

  const spriteList: SpriteMutable[] = [];

  for (const {
    texture,
    bounds,
    pivot,
    zIndex,
    hitArea,
  } of furnitureDirectionData.textures) {
    const $sprite = sprite({
      spriteSheet: DUMMY_FURNITURE_DATA.spriteSheet,
      texture,
      position: getPositionFromIsometricPosition(point),
      zIndex: positionZIndex + zIndex + 0.1,
      pivot: {
        x: bounds.width / 2 - pivot.x - TILE_SIZE.width / 2,
        y: bounds.height - pivot.y - TILE_SIZE.height / 2,
      },
      eventMode: EventMode.STATIC,
      cursor: Cursor.POINTER,
      hitArea,
    });
    $sprite.on(DisplayObjectEvent.POINTER_ENTER, () => {
      System.events.emit(SystemEvent.CURSOR_COORDS, {
        position: point,
      });
    });
    $sprite.on(DisplayObjectEvent.POINTER_TAP, (event: MouseEvent) => {
      System.proxy.emit(Event.POINTER_TILE, {
        position: {
          x: point.x,
          z: point.z,
        },
      });
    });
    spriteList.push($sprite);
  }

  return $component.getComponent(dummyFurnitureComponent, {
    getSpriteList: () => spriteList,
    $destroy: () => {
      spriteList.forEach((sprite) => sprite.$destroy());
      $$destroy();
    },
  });
};
