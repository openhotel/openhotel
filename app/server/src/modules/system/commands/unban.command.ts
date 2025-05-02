import { Command, CommandRoles } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";
import { System } from "modules/system/main.ts";
import { getTextFromArgs } from "shared/utils/args.utils.ts";

export const unbanCommand: Command = {
  command: "unban",
  role: CommandRoles.OP,
  usages: ["<username>"],
  description: "command.unban.description",
  func: async ({ user, args }) => {
    const username = args[0] as string;
    if (!username) return;

    const config = await System.game.users.getConfig();
    config.blacklist.users = config.blacklist.users.filter(
      (u) => u !== username,
    );

    await System.game.users.setConfig(config);

    user.emit(ProxyEvent.SYSTEM_MESSAGE, {
      message: getTextFromArgs("User {{username}} has been unbanned", {
        username,
      }),
    });
  },
};
