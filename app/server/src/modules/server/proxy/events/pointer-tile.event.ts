import { ProxyEventType } from "shared/types/main.ts";
import { ProxyEvent, RoomPoint } from "shared/enums/main.ts";
import { Server } from "modules/server/main.ts";

export const pointerTileEvent: ProxyEventType<any> = {
  event: ProxyEvent.POINTER_TILE,
  func: ({ data: { position }, user }) => {
    const room = Server.rooms.getUserRoom(user);
    console.debug("tile", room.id, user.id);

    if (!room) return;

    const foundUser = Server.rooms
      .getUsers(room.id)
      .find(
        ({ position: $position }) =>
          position.x === $position.x && position.z === $position.z,
      );

    try {
      const roomPoint = room.layout[position.x][position.z];
      // Leave room
      if (roomPoint === RoomPoint.SPAWN) {
        Server.rooms.removeUser(user);
        return;
      }
    } catch (e) {
      //TODO Invalid position
    }

    if (foundUser) return;

    Server.rooms.setUserPosition(room.id, user, {
      ...position,
      y: 0,
    });

    Server.proxy.emitRoom({
      event: ProxyEvent.MOVE_HUMAN,
      roomId: room.id,
      data: {
        userId: user.id,
        position,
      },
    });
  },
};
