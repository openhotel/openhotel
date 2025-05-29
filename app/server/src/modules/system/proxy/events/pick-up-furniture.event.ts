import { PrivateRoomMutable, ProxyEventType } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";
import { System } from "modules/system/main.ts";

export const pickUpFurnitureEvent: ProxyEventType<any> = {
  event: ProxyEvent.PICK_UP_FURNITURE,
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

    await user.moveFurnitureFromRoomToInventory(furniture.id);
  },
};
