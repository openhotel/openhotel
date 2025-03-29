import {
  container,
  ContainerComponent,
  Cursor,
  EventMode,
  sprite,
} from "@tu/tulip";
import { FurnitureDirectionData, RoomFurniture } from "shared/types";
import { TILE_SIZE } from "shared/consts";
import { System } from "system";

type Props = {
  furniture: RoomFurniture;
};

export const previewFurnitureComponent: ContainerComponent<Props> = (props) => {
  const $container = container<Props>(props);

  const { furniture } = $container.getProps();
  const { furnitureId, direction, id } = furniture;

  try {
    const furnitureData = System.game.furniture.get(furnitureId);

    const furnitureDirectionData = furnitureData.direction[
      direction
    ] as FurnitureDirectionData;

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
        zIndex,
        pivot: {
          x: bounds.width / 2 - pivot.x - TILE_SIZE.width / 2,
          y: bounds.height - pivot.y - TILE_SIZE.height / 2,
        },
        eventMode: EventMode.STATIC,
        cursor: Cursor.POINTER,
        hitArea,
      });
      $container.add($sprite);
    }
  } catch (e) {
    console.error(`Something went wrong with furniture '${id}'`);
  }

  return $container.getComponent(previewFurnitureComponent);
};
