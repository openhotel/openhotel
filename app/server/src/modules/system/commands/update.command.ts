import { System } from "modules/system/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";
import { Command, CommandRoles } from "shared/types/main.ts";
import { getTextFromArgs } from "shared/utils/args.utils.ts";

export const updateCommand: Command = {
  command: "update",
  role: CommandRoles.OP,
  usages: [""],
  description: "command.update.description",
  func: async ({ user }) => {
    System.proxy.$emit(ProxyEvent.$UPDATE);
    user.emit(ProxyEvent.SYSTEM_MESSAGE, {
      message: getTextFromArgs("Checking new versions..."),
    });
  },
};
