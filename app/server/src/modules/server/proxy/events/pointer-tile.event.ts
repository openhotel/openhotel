import { ProxyEventType } from "shared/types/main.ts";
import { ProxyEvent, RoomPointEnum } from "shared/enums/main.ts";
import { Server } from "modules/server/main.ts";
import { isPoint3dEqual } from "shared/utils/main.ts";

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

    const pathfinding = $room.findPath(
      user.getPosition(),
      position,
      user.getId(),
    );

    //Path is not possible
    if (!pathfinding.length) return;

    user.setPathfinding(pathfinding);
  },
};
