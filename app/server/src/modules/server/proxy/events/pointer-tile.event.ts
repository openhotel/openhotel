import { ProxyEventType } from "shared/types/main.ts";
import { ProxyEvent, RoomPointEnum } from "shared/enums/main.ts";
import { Server } from "modules/server/main.ts";

export const pointerTileEvent: ProxyEventType<any> = {
  event: ProxyEvent.POINTER_TILE,
  func: ({ data: { position }, user }) => {
    const room = Server.rooms.getUserRoom(user);

    if (!room) return;

    const roomLayout = structuredClone(room.layout);

    //when click on the outside, leave the room
    try {
      const roomPoint = roomLayout[position.x][position.z];
      // Leave room
      if (roomPoint === RoomPointEnum.SPAWN) {
        Server.rooms.removeUser(user);
        return;
      }
    } catch (e) {
      //TODO Invalid position
    }

    const roomUsers = Server.rooms
      .getUsers(room.id)
      .filter(({ user: $user }) => user.id !== $user.id);
    const foundUser = roomUsers.find(
      ({ position: $position }) =>
        position.x === $position.x && position.z === $position.z,
    );

    // Cannot go to the same spot
    if (foundUser) return;

    //remove from the roomLayout the users
    for (const { position } of roomUsers) {
      //if spawn, ignore
      if (roomLayout[position.x][position.z] === RoomPointEnum.SPAWN) continue;
      //if is occupied, set as empty
      roomLayout[position.x][position.z] = RoomPointEnum.EMPTY;
    }
    //TODO remove from the roomLayout the objects

    try {
      const roomPoint = roomLayout[position.x][position.z];
      // Leave room
      if (roomPoint === RoomPointEnum.SPAWN) {
        Server.rooms.removeUser(user);
        return;
      }
    } catch (e) {
      //TODO Invalid position
    }

    // TODO: change when server loop https://github.com/openhotel/openhotel/issues/35
    // TODO: reserve path positions
    const userRoom = Server.rooms.getUser(room.id, user.id);
    const path = Server.rooms.getGridLayout(roomLayout).findPath(
      { x: userRoom.position.x, y: userRoom.position.z },
      { x: position.x, y: position.z },
      {
        maxJumpCost: 5,
      },
    );

    //Path is not possible
    if (!path.length) return;

    Server.rooms.setUserPosition(room.id, user, {
      ...position,
      y: 0,
    });

    Server.proxy.emitRoom({
      event: ProxyEvent.MOVE_HUMAN,
      roomId: room.id,
      data: {
        userId: user.id,
        path,
      },
    });
  },
};
