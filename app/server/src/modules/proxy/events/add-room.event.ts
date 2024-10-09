import { ProxyEventType } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";
import { Proxy } from "modules/proxy/main.ts";

export const addRoomEvent: ProxyEventType<{
  roomId: string;
  accountId: string;
}> = {
  event: ProxyEvent.$ADD_ROOM,
  func: ({ data: { roomId, accountId } }) => {
    try {
      const user = Proxy.getUser(accountId);
      if (!user) return;

      Proxy.getRoom?.(roomId)?.addClient?.(user.clientId);
    } catch (e) {
      console.error("Error $ADD_ROOM");
      console.error(e);
    }
  },
};
