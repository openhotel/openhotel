import { ProxyEventType } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";
import { System } from "modules/system/main.ts";

export const typingEndEvent: ProxyEventType = {
  event: ProxyEvent.TYPING_END,
  func: async ({ user }) => {
    const room = await System.game.rooms.get(user.getRoom());
    if (!room) return;

    room.emit(ProxyEvent.TYPING_END, { accountId: user.getAccountId() });
  },
};
