import { ProxyEventType } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";

export const pointerTileEvent: ProxyEventType<any> = {
  event: ProxyEvent.POINTER_TILE,
  func: async ({ data: { position }, user }) => {
    await user.setTargetPosition(position);
  },
};
