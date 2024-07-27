import { Server } from "modules/server/main.ts";
import { ProxyEvent } from "shared/enums/event.enum.ts";

export const updateCommand = {
  command: "update",
  func: async () => {
    Server.proxy.$emit(ProxyEvent.$UPDATE, { a: 123 });
  },
};
