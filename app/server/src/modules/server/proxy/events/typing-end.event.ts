import { ProxyEventType } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";
import { Server } from "modules/server/main.ts";

export const typingEndEvent: ProxyEventType = {
  event: ProxyEvent.TYPING_END,
  func: async ({ user }) => {
    const room = Server.rooms.getUserRoom(user);
    if (!room) return;

    Server.proxy.emitRoom({
      roomId: room.id,
      event: ProxyEvent.TYPING_END,
      data: {
        userId: user.id,
      },
    });
  },
};
