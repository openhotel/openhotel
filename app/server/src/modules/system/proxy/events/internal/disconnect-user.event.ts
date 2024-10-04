import { ProxyEventType } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";
import { System } from "modules/system/main.ts";

export const disconnectUserEvent: ProxyEventType<{ accountId: string }> = {
  event: ProxyEvent.$DISCONNECT_USER,
  func: ({ data: { accountId } }) => {
    System.game.users.get({ accountId })?.disconnect();
  },
};
