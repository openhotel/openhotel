import {
  Component,
  component,
  Cursor,
  DisplayObjectEvent,
  EventMode,
  sprite,
  SpriteMutable,
} from "@tulib/tulip";
import { FurnitureDirectionData, Point3d } from "shared/types";
import { TILE_SIZE } from "shared/consts";
import { System } from "system";
import { CrossDirection, Furniture, SystemEvent } from "shared/enums";
import { getPositionFromIsometricPosition } from "shared/utils";

type Props = {
  isometricPosition: Point3d;
  furniture: Furniture;
  direction: CrossDirection;
};

type Mutable = {
  getSpriteList: () => SpriteMutable[];
};

export const furnitureComponent: Component<Props, Mutable> = (props) => {
  const $component = component<Props, Mutable>(props);

  const { furniture, direction, isometricPosition } = $component.getProps();
  const furnitureData = System.game.furniture.get(furniture);

  const furnitureDirectionData = furnitureData.direction[
    CrossDirection[direction].toLowerCase()
  ] as FurnitureDirectionData;

  isometricPosition.y = System.game.rooms.getYFromPoint(
    isometricPosition,
    true,
  );

  const positionZIndex =
    isometricPosition.x + isometricPosition.z - isometricPosition.y;

  const spriteList: SpriteMutable[] = [];

  for (const {
    texture,
    bounds,
    pivot,
    zIndex,
    hitArea,
  } of furnitureDirectionData.textures) {
    const $sprite = sprite({
      spriteSheet: furnitureData.spriteSheet,
      texture,
      position: getPositionFromIsometricPosition(isometricPosition),
      zIndex: positionZIndex + zIndex + 0.1,
      pivot: {
        x: bounds.width / 2 - pivot.x - TILE_SIZE.width / 2,
        y: bounds.height - pivot.y - TILE_SIZE.height / 2,
      },
      eventMode: EventMode.STATIC,
      cursor: Cursor.POINTER,
      hitArea,
    });
    $sprite.on(DisplayObjectEvent.POINTER_TAP, () => {
      System.events.emit(SystemEvent.SHOW_PREVIEW, {
        type: "furniture",
        spriteSheet: furnitureData.spriteSheet,
        texture,
        name: furnitureData.label,
      });
    });
    spriteList.push($sprite);
  }

  return $component.getComponent(furnitureComponent, {
    getSpriteList: () => spriteList,
  });
};
