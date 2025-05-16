import { Command, CommandRoles } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";
import { System } from "modules/system/main.ts";

export const tokenCommand: Command = {
  command: "token",
  role: CommandRoles.OP,
  usages: [],
  description: "command.token.description",
  func: async ({ user }) => {
    user.emit(ProxyEvent.SYSTEM_MESSAGE, {
      message: System.getToken(),
    });
  },
};
