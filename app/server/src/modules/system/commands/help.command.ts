import { Command, CommandRoles } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";
import { commandList } from "./main.ts";
import { getTextFromArgs } from "shared/utils/args.utils.ts";

export const helpCommand: Command = {
  command: "help",
  usages: ["", "<command>"],
  role: CommandRoles.USER,
  description: "command.help.description",
  func: async ({ user, args }) => {
    if (args.length === 1) {
      const command = args[0] as string;
      const cmd = commandList.find((c) => c.command === command);
      if (!cmd) {
        user.emit(ProxyEvent.SYSTEM_MESSAGE, {
          message: "Command not found",
        });
        return;
      }

      const description = cmd.description
        ? getTextFromArgs(cmd.description)
        : "No description available";

      user.emit(ProxyEvent.SYSTEM_MESSAGE, {
        message: getTextFromArgs("{{command}}: {{description}}", {
          command: cmd.command,
          description: description,
        }),
      });
      return;
    }

    const isOp = await user.isOp();

    user.emit(ProxyEvent.SYSTEM_MESSAGE, {
      message: getTextFromArgs("Available commands: {{commands}}", {
        commands: commandList
          .filter((c) =>
            c.command !== "help" && !isOp ? c.role === CommandRoles.USER : true,
          )
          .map((c) => c.command)
          .join(", "),
      }),
    });
  },
};
