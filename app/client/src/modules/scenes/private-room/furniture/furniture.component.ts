import {
  component,
  ContainerComponent,
  Cursor,
  DisplayObjectEvent,
  EventMode,
  sprite,
  SpriteMutable,
} from "@tu/tulip";
import { FurnitureDirectionData, RoomFurniture } from "shared/types";
import { TILE_SIZE } from "shared/consts";
import { System } from "system";
import { Event, FurnitureType, SystemEvent } from "shared/enums";
import { getPositionFromIsometricPosition } from "shared/utils";

type Props = {
  furniture: RoomFurniture;
};

export type FurnitureMutable = {
  getSpriteList: () => SpriteMutable[];
};

export const furnitureComponent: ContainerComponent<Props, FurnitureMutable> = (
  props,
) => {
  const $component = component<Props, FurnitureMutable>(props);

  const { furniture } = $component.getProps();
  const { furnitureId, direction, id, position, type } = furniture;

  const $$destroy = $component.$destroy;

  const spriteList: SpriteMutable[] = [];

  try {
    const furnitureData = System.game.furniture.get(furnitureId);

    const furnitureDirectionData = furnitureData.direction[
      direction
    ] as FurnitureDirectionData;

    const positionZIndex = position.x + position.z - position.y;

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
        position: getPositionFromIsometricPosition(position),
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
          position,
        });
      });
      $sprite.on(DisplayObjectEvent.POINTER_TAP, (event: MouseEvent) => {
        if (event.shiftKey) {
          System.events.emit(SystemEvent.CHAT_INPUT_APPEND_TEXT, id);
          console.info(id);
          return;
        }

        System.events.emit(SystemEvent.SHOW_PREVIEW, {
          type: "furniture",
          furniture,
        });

        if (type === FurnitureType.TELEPORT) {
          System.proxy.emit(Event.POINTER_INTERACTIVE, {
            position: {
              x: position.x,
              z: position.z,
            },
          });
        }
        System.proxy.emit(Event.POINTER_TILE, {
          position: {
            x: position.x,
            z: position.z,
          },
        });
      });
      spriteList.push($sprite);
    }
  } catch (e) {
    console.error(`Something went wrong with furniture '${id}'`);
  }

  return $component.getComponent(furnitureComponent, {
    getSpriteList: () => spriteList,
    $destroy: () => {
      spriteList.forEach((sprite) => sprite.$destroy());
      $$destroy();
    },
  });
};
