import { System } from "modules/system/main.ts";
import { Command } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";
import { __ } from "shared/utils/main.ts";

export const kickCommand: Command = {
  command: "kick",
  func: async ({ user, args }) => {
    const username = args[0] as string;
    if (!username) return;

    const kickUser = System.game.users.get({ username });
    if (!kickUser) return;

    kickUser.disconnect();

    user.emit(ProxyEvent.SYSTEM_MESSAGE, {
      message: __(user.getLanguage())("User {{username}} kicked", { username }),
    });
  },
};
