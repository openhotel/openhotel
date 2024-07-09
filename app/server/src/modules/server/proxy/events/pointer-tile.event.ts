import { ProxyEventType } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";
import { Server } from "modules/server/main.ts";

export const pointerTileEvent: ProxyEventType<any> = {
  event: ProxyEvent.POINTER_TILE,
  func: ({ data: { position }, user }) => {
    const room = Server.rooms.getUserRoom(user);

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
