import { ProxyEventType } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";
import { Server } from "modules/server/main.ts";

export const joinRoomEvent: ProxyEventType<{ roomId: string }> = {
  event: ProxyEvent.JOIN_ROOM,
  func: ({ data: { roomId }, user }) => {
    Server.proxy.$emit(ProxyEvent.$ADD_ROOM, {
      userId: user.id,
      roomId,
    });

    Server.proxy.emit({
      event: ProxyEvent.LOAD_ROOM,
      users: user.id,
      data: {
        room: Server.rooms.get(roomId),
      },
    });

    Server.rooms.addUser(roomId, user);
  },
};
