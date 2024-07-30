import { Server } from "modules/server/main.ts";

export const kickCommand = {
  command: "kick",
  func: async ({ args }) => {
    const username = args[0];
    if (!username) return;

    const user = Server.game.users.get({ username });
    if (!user) return;

    user.disconnect();
  },
};
