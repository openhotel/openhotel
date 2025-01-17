import {
  container,
  ContainerComponent,
  Cursor,
  EventMode,
  sprite,
} from "@tu/tulip";
import { FurnitureDirectionData, RoomFurnitureFrame } from "shared/types";
import { TILE_SIZE } from "shared/consts";
import { System } from "system";

type Props = {
  furniture: RoomFurnitureFrame;
};

export const previewFurnitureFrameComponent: ContainerComponent<Props> = (
  props,
) => {
  const $container = container<Props>(props);

  const { furniture } = $container.getProps();
  const { furnitureId, direction } = furniture;
  const furnitureData = System.game.furniture.get(furnitureId);

  const furnitureDirectionData = furnitureData.direction[
    direction
  ] as FurnitureDirectionData;

  const { texture, bounds, zIndex, hitArea } =
    furnitureDirectionData.textures[0];

  const $sprite = sprite({
    spriteSheet: furnitureData.spriteSheet,
    texture,
    zIndex,
    pivot: {
      x: -TILE_SIZE.width / 2 + bounds.width / 2,
      y: bounds.height / 2,
    },
    eventMode: EventMode.STATIC,
    cursor: Cursor.POINTER,
    hitArea,
  });
  $container.add($sprite);

  return $container.getComponent(previewFurnitureFrameComponent);
};
