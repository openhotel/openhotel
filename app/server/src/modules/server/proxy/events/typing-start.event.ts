import { ProxyEventType } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";
import { Server } from "modules/server/main.ts";

export const typingStartEvent: ProxyEventType = {
  event: ProxyEvent.TYPING_START,
  func: async ({ user }) => {
    const room = Server.game.rooms.get(user.getRoom());
    if (!room) return;

    room.emit(ProxyEvent.TYPING_START, { userId: user.getId() });
  },
};
