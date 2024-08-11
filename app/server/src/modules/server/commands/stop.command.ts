import { Command } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";

export const stopCommand: Command = {
  command: "stop",
  func: ({ user }) => {
    user.emit(ProxyEvent.SYSTEM_MESSAGE, {
      message: "Stopping server...",
    });

    //@ts-ignore
    Deno.exit();
  },
};
