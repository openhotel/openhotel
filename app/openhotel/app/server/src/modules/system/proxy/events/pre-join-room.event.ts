import { ProxyEventType } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";

export const preJoinRoomEvent: ProxyEventType<{ roomId: string }> = {
  event: ProxyEvent.PRE_JOIN_ROOM,
  func: async ({ data: { roomId }, user }) => {
    await user.preMoveToRoom(roomId);
  },
};
