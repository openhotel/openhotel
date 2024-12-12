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
import { CrossDirection, Event, SystemEvent } from "shared/enums";
import {
  getPositionFromIsometricPosition,
  isPosition3dEqual,
} from "shared/utils";

type Props = {
  id: string;
  isometricPosition: Point3d;
  furniture: string;
  direction: CrossDirection;
  interactive: boolean;
};

export type FurnitureMutable = {
  getSpriteList: () => SpriteMutable[];
};

export const furnitureComponent: ContainerComponent<Props, FurnitureMutable> = (
  props,
) => {
  const $component = component<Props, FurnitureMutable>(props);

  const $$destroy = $component.$destroy;

  const { furniture, direction, isometricPosition, interactive, id } =
    $component.getProps();
  const furnitureData = System.game.furniture.get(furniture);

  const furnitureDirectionData = furnitureData.direction[
    direction
  ] as FurnitureDirectionData;

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
    $sprite.on(DisplayObjectEvent.POINTER_ENTER, () => {
      System.events.emit(SystemEvent.CURSOR_COORDS, {
        position: isometricPosition,
      });
    });
    $sprite.on(DisplayObjectEvent.POINTER_TAP, (event: MouseEvent) => {
      if (event.shiftKey) {
        System.events.emit(SystemEvent.CHAT_INPUT_APPEND_TEXT, id);
        return;
      }

      System.events.emit(SystemEvent.SHOW_PREVIEW, {
        type: "furniture",
        spriteSheet: furnitureData.spriteSheet,
        texture,
        name: furnitureData.label,
      });

      // System.game.users.getCurrentUser().position

      // const currentUser = System.game.users.getCurrentUser();

      if (interactive) {
        System.proxy.emit(Event.POINTER_INTERACTIVE, {
          position: {
            x: isometricPosition.x,
            z: isometricPosition.z,
          },
        });
      }
      System.proxy.emit(Event.POINTER_TILE, {
        position: {
          x: isometricPosition.x,
          z: isometricPosition.z,
        },
      });
    });
    spriteList.push($sprite);
  }

  return $component.getComponent(furnitureComponent, {
    getSpriteList: () => spriteList,
    $destroy: () => {
      spriteList.forEach((sprite) => sprite.$destroy());
      $$destroy();
    },
  });
};
