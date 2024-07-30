import { ProxyEventType } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";
import { Server } from "modules/server/main.ts";
import {
  getRandomNumberFromSeed,
  getUsersConfig,
  log,
} from "shared/utils/main.ts";
import { executeCommand } from "modules/server/commands/main.ts";

export const messageEvent: ProxyEventType<{ message: string }> = {
  event: ProxyEvent.MESSAGE,
  func: async ({ user, data: { message } }) => {
    const room = Server.game.rooms.get(user.getRoom());
    if (!room) return;

    log(`[${room.getId()}] ${user.getUsername()}: ${message}`);

    const isOp = (await getUsersConfig()).op.users.includes(user.getUsername());

    if (isOp && executeCommand({ message, user })) return;

    room.emit(ProxyEvent.MESSAGE, {
      userId: user.getId(),
      message,
      color: isOp ? 0 : await getRandomNumberFromSeed(user.getUsername()),
    });
  },
};
