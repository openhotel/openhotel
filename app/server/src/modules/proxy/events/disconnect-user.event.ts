import { ProxyEventType } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";
import { Proxy } from "modules/proxy/main.ts";

export const disconnectUserEvent: ProxyEventType<{ clientId: string }> = {
  event: ProxyEvent.$DISCONNECT_USER,
  func: ({ data: { clientId } }) => {
    Proxy.getClient(clientId)?.close?.();
  },
};
