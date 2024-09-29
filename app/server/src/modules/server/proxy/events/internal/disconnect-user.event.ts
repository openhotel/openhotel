import { ProxyEventType } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";
import { Server } from "modules/server/main.ts";

export const disconnectUserEvent: ProxyEventType<{ accountId: string }> = {
  event: ProxyEvent.$DISCONNECT_USER,
  func: ({ data: { accountId } }) => {
    Server.game.users.get({ accountId })?.disconnect();
  },
};
