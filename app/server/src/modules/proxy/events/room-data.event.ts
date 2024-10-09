import { ProxyEventType } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";
import { Proxy } from "modules/proxy/main.ts";

export const roomDataEvent: ProxyEventType<{
  roomId: string;
  event: string;
  message: unknown;
}> = {
  event: ProxyEvent.$ROOM_DATA,
  func: ({ data: { roomId, event, message } }) => {
    try {
      Proxy.getRoom?.(roomId)?.emit?.(event, message);
    } catch (e) {
      console.error("Error $ROOM_DATA");
      console.error(e);
    }
  },
};
