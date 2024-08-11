import { Server } from "modules/server/main.ts";
import { Command } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";

export const kickCommand: Command = {
  command: "kick",
  func: async ({ user, args }) => {
    const username = args[0] as string;
    if (!username) return;

    const kickUser = Server.game.users.get({ username });
    if (!kickUser) return;

    kickUser.disconnect();

    user.emit(ProxyEvent.SYSTEM_MESSAGE, {
      message: `User ${username} kicked`,
    });
  },
};
