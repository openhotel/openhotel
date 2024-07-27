import { Server } from "modules/server/main.ts";
import { ProxyEvent } from "shared/enums/event.enum.ts";

export const kickCommand = {
  command: "kick",
  func: async ({ args }) => {
    const username = args[0];
    if (!username) return;

    const user = Server.users.get({ username });
    if (!user) return;

    Server.proxy.$emit(ProxyEvent.$DISCONNECT_USER, {
      clientId: user.clientId,
    });
  },
};
