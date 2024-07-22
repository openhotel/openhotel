import { ProxyEventType } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";
import { Server } from "modules/server/main.ts";
import {
  log,
  getRandomNumberFromSeed,
  getUsersConfig,
} from "shared/utils/main.ts";
import { executeCommand } from "modules/server/commands/main.ts";

export const messageEvent: ProxyEventType<{ message: string }> = {
  event: ProxyEvent.MESSAGE,
  func: async ({ user, data: { message } }) => {
    const room = Server.rooms.getUserRoom(user);
    if (!room) return;
    log(`[${room.id}] ${user.username}: ${message}`);

    const isOp = (await getUsersConfig()).op.users.includes(user.username);

    if (isOp && executeCommand({ message, user })) return;

    Server.proxy.emitRoom({
      roomId: room.id,
      event: ProxyEvent.MESSAGE,
      data: {
        userId: user.id,
        message,
        color: isOp ? 0 : await getRandomNumberFromSeed(user.username),
      },
    });
  },
};
