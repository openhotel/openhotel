import { System } from "modules/system/main.ts";
import { Command, CommandRoles } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";
import { getTextFromArgs } from "shared/utils/args.utils.ts";

export const kickCommand: Command = {
  command: "kick",
  usages: ["<username>"],
  role: CommandRoles.OP,
  description: "command.kick.description",
  func: async ({ user, args }) => {
    const username = args[0] as string;
    if (!username) return;

    const kickUser = System.game.users.get({ username });
    if (!kickUser || (await kickUser.isOp())) return;

    kickUser.disconnect();

    user.emit(ProxyEvent.SYSTEM_MESSAGE, {
      message: getTextFromArgs("User {{username}} kicked", { username }),
    });
  },
};
