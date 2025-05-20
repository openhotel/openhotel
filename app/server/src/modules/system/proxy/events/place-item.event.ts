import { PrivateRoomMutable, ProxyEventType } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";
import { System } from "modules/system/main.ts";

export const placeItemEvent: ProxyEventType<any> = {
  event: ProxyEvent.PLACE_ITEM,
  func: async ({ data: { position, id, direction, framePosition }, user }) => {
    const roomId = user.getRoom();
    if (!roomId) return;

    const room = await System.game.rooms.get<PrivateRoomMutable>(
      user.getRoom(),
    );
    if (room.type !== "private" || room.getOwnerId() !== user.getAccountId())
      return;

    const furniture = await user.getFurniture(id);
    if (!furniture) return;

    await user.moveFurnitureFromInventoryToRoom(
      id,
      position,
      direction,
      framePosition,
    );
  },
};
