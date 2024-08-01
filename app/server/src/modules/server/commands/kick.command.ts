import { Server } from "modules/server/main.ts";
import { Command } from "shared/types/main.ts";

export const kickCommand: Command = {
  command: "kick",
  func: async ({ args }) => {
    const username = args[0] as string;
    if (!username) return;

    const user = Server.game.users.get({ username });
    if (!user) return;

    user.disconnect();
  },
};
