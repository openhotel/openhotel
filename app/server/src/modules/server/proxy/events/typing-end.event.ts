import { ProxyEventType } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";
import { Server } from "modules/server/main.ts";

export const typingEndEvent: ProxyEventType = {
  event: ProxyEvent.TYPING_END,
  func: async ({ user }) => {
    const room = Server.game.rooms.get(user.getRoom());
    if (!room) return;

    room.emit(ProxyEvent.TYPING_END, { accountId: user.getAccountId() });
  },
};
