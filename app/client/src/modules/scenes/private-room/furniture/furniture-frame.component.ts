import {
  component,
  ContainerComponent,
  Cursor,
  DisplayObjectEvent,
  EventMode,
  sprite,
  SpriteMutable,
} from "@tu/tulip";
import { FurnitureDirectionData, RoomFurnitureFrame } from "shared/types";
import { TILE_SIZE } from "shared/consts";
import { System } from "system";
import { CrossDirection, SystemEvent } from "shared/enums";
import { getPositionFromIsometricPosition } from "shared/utils";

type Props = {
  furniture: RoomFurnitureFrame;
};

type Mutable = {
  getSpriteList: () => SpriteMutable[];
};

export const furnitureFrameComponent: ContainerComponent<Props, Mutable> = (
  props,
) => {
  const $component = component<Props, Mutable>(props);

  const {
    furniture: { furnitureId, direction, id, position, framePosition },
  } = $component.getProps();
  const furnitureData = System.game.furniture.get(furnitureId);

  const furnitureDirectionData = furnitureData.direction[
    direction
  ] as FurnitureDirectionData;

  const positionZIndex = position.x + position.z - position.y;

  const { texture, bounds, zIndex, hitArea } =
    furnitureDirectionData.textures[0];

  const isNorthDirection = direction === CrossDirection.NORTH;

  const $position = getPositionFromIsometricPosition(position);
  const frameIsometricPosition = {
    x: isNorthDirection ? framePosition.x * 2 : -framePosition.x * 2,
    y: -framePosition.y * 2 + framePosition.x,
  };

  const $sprite = sprite({
    spriteSheet: furnitureData.spriteSheet,
    texture,
    position: {
      x: $position.x + frameIsometricPosition.x,
      y: $position.y + frameIsometricPosition.y,
    },
    zIndex: positionZIndex + zIndex - 0.2,
    pivot: {
      x: -TILE_SIZE.width / 2 + bounds.width / 2,
      y: bounds.height / 2,
    },
    eventMode: EventMode.STATIC,
    cursor: Cursor.POINTER,
    hitArea,
  });
  $sprite.on(DisplayObjectEvent.POINTER_TAP, (event: MouseEvent) => {
    if (event.shiftKey) {
      System.events.emit(SystemEvent.CHAT_INPUT_APPEND_TEXT, id);
      console.info(id);
      return;
    }
    System.events.emit(SystemEvent.SHOW_PREVIEW, {
      type: "furniture",
      spriteSheet: furnitureData.spriteSheet,
      texture,
      name: furnitureData.label,
    });
  });

  return $component.getComponent(furnitureFrameComponent, {
    getSpriteList: () => [$sprite],
  });
};
