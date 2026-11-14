import { PrivateRoomMutable, ProxyEventType } from "shared/types/main.ts";
import {
  CrossDirection,
  FurnitureType,
  ProxyEvent,
} from "shared/enums/main.ts";
import { System } from "modules/system/main.ts";
import { getNextCrossDirection } from "shared/utils/direction.utils.ts";

export const rotateFurnitureEvent: ProxyEventType<any> = {
  event: ProxyEvent.ROTATE_FURNITURE,
  func: async ({ data: { id }, user }) => {
    const roomId = user.getRoom();
    if (!roomId) return;

    const room = await System.game.rooms.get<PrivateRoomMutable>(
      user.getRoom(),
    );
    if (room.type !== "private" || room.getOwnerId() !== user.getAccountId())
      return;

    const furniture = room
      .getFurniture()
      .find((furniture) => furniture.id === id);
    if (!furniture) return;

    if (furniture.type === FurnitureType.FRAME) return;

    const furnitureData = await System.game.furniture.get(
      furniture.furnitureId,
    );

    //Do not update furniture because cannot be rotated
    if (
      Object.values(furnitureData.direction).filter(
        ({ textures }) => textures.length,
      ).length === 1
    )
      return;

    let nextTargetDirection = furniture.direction;
    for (let i = furniture.direction; i < furniture.direction + 3; i++) {
      nextTargetDirection = getNextCrossDirection(nextTargetDirection);

      if (
        furnitureData.direction[
          CrossDirection[nextTargetDirection].toLowerCase()
        ]?.textures?.length
      )
        break;
    }

    //security check to prevent sending unnecessary events + write/read db
    if (nextTargetDirection === furniture.direction) return;

    furniture.direction = nextTargetDirection;
    await room.updateFurniture(furniture);
  },
};
