import { ProxyEventType } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";
import { System } from "modules/system/main.ts";
import { log } from "shared/utils/main.ts";
import { executeCommand } from "modules/system/commands/main.ts";
import { getRandomNumberFromSeed } from "@oh/utils";

export const messageEvent: ProxyEventType<{ message: string }> = {
  event: ProxyEvent.MESSAGE,
  func: async ({ user, data: { message } }) => {
    const room = await System.game.rooms.get(user.getRoom());
    if (!room) return;

    //Prevent spam the same message
    if (user.getLastMessage() === message) return;

    log(`[${room.getId()}] ${user.getUsername()}: ${message}`);

    const isOp = await user.isOp();

    if (isOp && executeCommand({ message, user })) return;

    user.setLastMessage(message);
    room.emit(ProxyEvent.MESSAGE, {
      accountId: user.getAccountId(),
      message,
      color: isOp ? 0 : await getRandomNumberFromSeed(user.getUsername()),
    });
  },
};
