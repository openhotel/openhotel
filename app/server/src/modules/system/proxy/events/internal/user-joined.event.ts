import { ProxyEventType, PrivateUser } from "shared/types/main.ts";
import { Meta, ProxyEvent } from "shared/enums/main.ts";
import { System } from "modules/system/main.ts";
import { log } from "shared/utils/main.ts";
import { getDirection, getPointFromCrossDirection } from "@oh/utils";

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
    log(`${privateUser.username} joined!`);

    const currentUser = System.game.users.get({
      accountId: privateUser.accountId,
    });

    //TODO process meta

    if (!(await currentUser.isOp())) return;

    if (meta?.[0] === Meta.TELEPORT) {
      const teleport = await System.game.teleports.get(meta[1] as string);

      const room = await System.game.rooms.get(teleport.roomId);
      if (!room) return;
      const furniture = room.getFurnitures();
      const teleportFurniture = furniture.find(
        (furniture) => furniture.uid === meta[1],
      );

      if (!teleportFurniture) return;

      const teleportPosition = teleportFurniture.position;

      await room.addUser(currentUser.getObject(), teleportPosition);
      currentUser.setBodyDirection(teleportFurniture.direction);

      const nextAddedPosition = getPointFromCrossDirection(
        teleportFurniture.direction,
      );
      const nextPosition = {
        x: teleportPosition.x + nextAddedPosition.x,
        y: teleportPosition.y,
        z: teleportPosition.z + nextAddedPosition.z,
      };
      const targetBodyDirection = getDirection(teleportPosition, nextPosition);
      if (!room.isPointFree(nextPosition)) return;

      currentUser.setBodyDirection(targetBodyDirection);
      currentUser.setPosition(nextPosition);
      room.emit(ProxyEvent.MOVE_HUMAN, {
        accountId: currentUser.getAccountId(),
        position: nextPosition,
        bodyDirection: targetBodyDirection,
      });
    }
  },
};
