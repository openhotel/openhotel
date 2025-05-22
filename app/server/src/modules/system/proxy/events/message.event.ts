import { ProxyEventType } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";
import { System } from "modules/system/main.ts";
import { log } from "shared/utils/main.ts";
import { executeCommand } from "modules/system/commands/main.ts";
import { getRandomNumberFromSeed } from "@oh/utils";
import { ulid } from "@std/ulid";
import { MAX_MESSAGE_LENGTH } from "shared/consts/messages.consts.ts";

export const messageEvent: ProxyEventType<{ message: string }> = {
  event: ProxyEvent.MESSAGE,
  func: async ({ user, data: { message } }) => {
    const room = await System.game.rooms.get(user.getRoom());
    if (!room) return;

    if (
      //Prevent spam the same message
      user.getLastMessage() === message ||
      message.length === 0 ||
      message.length >= MAX_MESSAGE_LENGTH
    )
      return;

    log(`[${room.getId()}] ${user.getUsername()}: ${message}`);

    const isCommand = await executeCommand({ message, user });
    if (isCommand) return;

    const isOp = await user.isOp();

    user.setLastMessage(message);
    room.emit(ProxyEvent.MESSAGE, {
      id: ulid(),
      accountId: user.getAccountId(),
      message,
      color:
        (await user.getColor()) ??
        (isOp ? 0 : await getRandomNumberFromSeed(user.getUsername())),
    });
  },
};
