import { PrivateRoomMutable, ProxyEventType } from "shared/types/main.ts";
import { FurnitureType, ProxyEvent } from "shared/enums/main.ts";
import { System } from "modules/system/main.ts";

export const moveFurnitureEvent: ProxyEventType<any> = {
  event: ProxyEvent.MOVE_FURNITURE,
  func: async ({ data: { id, position, framePosition, direction }, user }) => {
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

    try {
      if (isNaN(room.getPoint(position) as number)) return false;
    } catch (e) {
      return false;
    }

    furniture.position = position;
    furniture.direction = direction;

    if (furniture.type === FurnitureType.FRAME)
      furniture.framePosition = framePosition;

    await room.updateFurniture(furniture);
  },
};
