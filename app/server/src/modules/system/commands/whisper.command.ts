import { Command, CommandRoles } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/event.enum.ts";
import { System } from "../main.ts";
import { ulid } from "@std/ulid";

export const whisperCommand: Command = {
  command: ["whisper", "w"],
  role: CommandRoles.USER,
  description: "command.whisper.description",
  func: async ({ user, args }) => {
    const [username, ...messages] = args as [string, string];
    if (!username || !messages.length) return;
    if (username === user.getUsername()) return;

    const targetUser = System.game.users.get({ username });
    if (!targetUser) return;

    const userRoom = user.getRoom();
    const targetUserRoom = targetUser.getRoom();

    if (userRoom !== targetUserRoom) return;

    const message = messages.join(" ");
    user.setLastMessage(message);

    targetUser.setLastWhisper(user);

    const data = {
      id: ulid(),
      accountId: user.getAccountId(),
      message,
      color: 0x1e1e1e,
    };

    user.emit(ProxyEvent.WHISPER_MESSAGE, data);
    targetUser.emit(ProxyEvent.WHISPER_MESSAGE, data);
  },
};
