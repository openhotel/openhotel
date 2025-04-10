import { Command, CommandRoles } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/event.enum.ts";
import { ulid } from "@std/ulid";

export const replyCommand: Command = {
  command: ["reply", "r"],
  role: CommandRoles.USER,
  description: "command.reply.description",
  func: async ({ user, args }) => {
    const [...messages] = args as [string, string];
    if (!messages.length) return;

    const whisperUser = user.getLastWhisper();
    if (!whisperUser) return;

    const userRoom = user.getRoom();
    const targetUserRoom = whisperUser.getRoom();

    if (userRoom !== targetUserRoom) return;

    const message = messages.join(" ");
    user.setLastMessage(message);

    whisperUser.setLastWhisper(user);

    const data = {
      id: ulid(),
      accountId: user.getAccountId(),
      message,
      color: 0x1e1e1e,
    };

    user.emit(ProxyEvent.WHISPER_MESSAGE, data);
    whisperUser.emit(ProxyEvent.WHISPER_MESSAGE, data);
  },
};
