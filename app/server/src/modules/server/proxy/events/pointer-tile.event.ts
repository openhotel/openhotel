import { ProxyEventType } from "shared/types/main.ts";
import { ProxyEvent, RoomPointEnum } from "shared/enums/main.ts";
import { Server } from "modules/server/main.ts";
import { isPoint3dEqual, wait, waitUntil } from "shared/utils/main.ts";
import { MOVEMENT_BETWEEN_TILES_DURATION } from "shared/consts/tiles.consts.ts";

export const pointerTileEvent: ProxyEventType<any> = {
  event: ProxyEvent.POINTER_TILE,
  func: async ({ data: { position }, user }) => {
    const $room = Server.game.rooms.get(user.getRoom());

    if (!$room) return;

    //check if position is spawn, and leave room
    if ($room.getPoint(position) === RoomPointEnum.SPAWN) {
      const userObject = user.getObject();
      $room.removeUser(userObject);
      return;
    }

    if (isPoint3dEqual(user.getPosition(), position))
      //same position
      return;

    const currentPath = user.getPathfinding();
    if (currentPath?.length) {
      const targetPosition = currentPath[currentPath.length - 1];

      //if target position is the same
      if (isPoint3dEqual(targetPosition, position)) return;

      $room.emit(ProxyEvent.STOP_HUMAN, {
        userId: user.getId(),
      });

      const nextPosition = currentPath[0];
      try {
        await waitUntil(() => isPoint3dEqual(user.getPosition(), nextPosition));
      } catch (e) {
        //Spam-click ignore
        return;
      }
      await wait(MOVEMENT_BETWEEN_TILES_DURATION / 2);
    }

    const path = $room.findPath(user.getPosition(), position, user.getId());

    //Path is not possible
    if (!path.length) return;

    $room.emit(ProxyEvent.MOVE_HUMAN, {
      userId: user.getId(),
      path,
    });
    user.setPosition(path.shift());
    user.setPathfinding(path);
  },
};
