import { ProxyEventType, PrivateUser } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";
import { System } from "modules/system/main.ts";

export const userJoinedEvent: ProxyEventType<{
  user: PrivateUser;
  meta: null | (number | string)[];
}> = {
  event: ProxyEvent.$USER_JOINED,
  func: async ({ data: { user: privateUser, meta } }) => {
    await System.game.users.add(
      {
        accountId: privateUser.accountId,
        username: privateUser.username,
        meta,
      },
      privateUser,
    );

    // const currentUser = System.game.users.get({
    //   accountId: privateUser.accountId,
    // });

    //TODO Teleport
    // if (meta?.[0] === Meta.TELEPORT) {
    //   const teleport = await System.game.teleports.get(meta[1] as string);
    //
    //   const room = await System.game.rooms.get<PrivateRoomMutable>(
    //     teleport.roomId,
    //   );
    //   if (!room || room.type !== "private") return;
    //   const furniture = room.getFurniture();
    //   const teleportFurniture = furniture.find(
    //     (furniture) => furniture.id === meta[1],
    //   );
    //
    //   if (!teleportFurniture) return;
    //
    //   const teleportPosition = teleportFurniture.position;
    //
    //   await room.addUser(currentUser.getObject(), teleportPosition);
    //   currentUser.setBodyDirection(teleportFurniture.direction);
    //
    //   const nextAddedPosition = getPointFromCrossDirection(
    //     teleportFurniture.direction,
    //   );
    //   const nextPosition = {
    //     x: teleportPosition.x + nextAddedPosition.x,
    //     y: teleportPosition.y,
    //     z: teleportPosition.z + nextAddedPosition.z,
    //   };
    //   const targetBodyDirection = getDirection(teleportPosition, nextPosition);
    //   if (!room.isPointFree(nextPosition)) return;
    //
    //   currentUser.setBodyDirection(targetBodyDirection);
    //   currentUser.setPosition(nextPosition);
    //   room.emit(ProxyEvent.MOVE_HUMAN, {
    //     accountId: currentUser.getAccountId(),
    //     position: nextPosition,
    //     bodyDirection: targetBodyDirection,
    //   });
    // }
  },
};
