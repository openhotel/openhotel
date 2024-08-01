import { Server } from "modules/server/main.ts";
import { ProxyEvent } from "shared/enums/event.enum.ts";
import { Command } from "shared/types/main.ts";

export const updateCommand: Command = {
  command: "update",
  func: async () => {
    Server.proxy.$emit(ProxyEvent.$UPDATE, { a: 123 });
  },
};
