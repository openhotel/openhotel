import { ProxyEventType } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";
import { Proxy } from "modules/proxy/main.ts";

export const removeRoomEvent: ProxyEventType<{
  roomId: string;
  accountId: string;
}> = {
  event: ProxyEvent.$REMOVE_ROOM,
  func: ({ data: { roomId, accountId } }) => {
    try {
      const user = Proxy.getUser(accountId);
      if (!user) return;

      Proxy.getRoom?.(roomId)?.removeClient?.(user?.clientId);
    } catch (e) {
      console.error("Error $REMOVE_ROOM");
      console.error(e);
    }
  },
};
