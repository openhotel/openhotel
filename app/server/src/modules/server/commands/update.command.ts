import { Server } from "modules/server/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";
import { Command } from "shared/types/main.ts";

export const updateCommand: Command = {
  command: "update",
  func: async ({ user }) => {
    Server.proxy.$emit(ProxyEvent.$UPDATE);
    user.emit(ProxyEvent.SYSTEM_MESSAGE, {
      message: "Checking new versions...",
    });
  },
};
