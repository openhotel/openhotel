import { Command } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";
import { commandList } from "./main.ts";

export const helpCommand: Command = {
  command: "help",
  func: async ({ user }) => {
    user.emit(ProxyEvent.SYSTEM_MESSAGE, {
      message: `Available commands: ${commandList
        .filter((c) => c.command !== "help")
        .map((c) => c.command)
        .join(", ")}`,
    });
  },
};
