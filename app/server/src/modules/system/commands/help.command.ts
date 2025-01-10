import { Command } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";
import { commandList } from "./main.ts";
import { __ } from "shared/utils/main.ts";

export const helpCommand: Command = {
  command: "help",
  usages: [
      "",
      "<command>",
  ],
  description: "command.help.description",
  func: async ({ user, args }) => {
    if (args.length === 1) {
        const command = args[0] as string;
        const cmd = commandList.find((c) => c.command === command);
        if (!cmd) {
            user.emit(ProxyEvent.SYSTEM_MESSAGE, {
            message: __(user.getLanguage())("Command not found"),
            });
            return;
        }

        const description = cmd.description ? __(user.getLanguage())(cmd.description) : __(user.getLanguage())("No description available");

        user.emit(ProxyEvent.SYSTEM_MESSAGE, {
            message: __(user.getLanguage())("{{command}}: {{description}}", {
                command: cmd.command,
                description: description,
            }),
        });
        return;
    }

    user.emit(ProxyEvent.SYSTEM_MESSAGE, {
      message: __(user.getLanguage())("Available commands: {{commands}}", {
        commands: commandList
          .filter((c) => c.command !== "help")
          .map((c) => c.command)
          .join(", "),
      }),
    });
  },
};
