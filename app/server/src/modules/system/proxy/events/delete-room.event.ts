import { PrivateRoomMutable, ProxyEventType } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";
import { System } from "modules/system/main.ts";

export const deleteRoomEvent: ProxyEventType<{ roomId: string }> = {
  event: ProxyEvent.DELETE_ROOM,
  func: async ({ data: { roomId }, user }) => {
    const room = await System.game.rooms.get<PrivateRoomMutable>(roomId);

    if (
      !room ||
      room.type !== "private" ||
      room.getOwnerId() !== user.getAccountId()
    )
      return;

    //kick all users
    for (const roomUserId of room.getUsers()) {
      const roomUser = System.game.users.get({ accountId: roomUserId });
      room.removeUser(roomUser.getObject());
    }

    await user.moveAllFurnitureFromRoomToInventory(roomId);

    await room.remove();
  },
};
