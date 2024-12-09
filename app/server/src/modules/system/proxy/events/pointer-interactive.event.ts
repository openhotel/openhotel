import { ProxyEventType } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";
import { isPoint3dEqual } from "@oh/utils";
import { System } from "modules/system/main.ts";

export const pointerInteractiveEvent: ProxyEventType<any> = {
  event: ProxyEvent.POINTER_INTERACTIVE,
  func: async ({ data: { position }, user }) => {
    if (!isPoint3dEqual(position, user.getPosition())) return;

    const teleport = System.game.teleports.getLocal(user.getRoom(), position);
    if (!teleport) return;

    const [x, z] = teleport;

    user.setPosition({
      x,
      z,
    });

    const room = await System.game.rooms.get(user.getRoom());
    room?.emit(ProxyEvent.SET_POSITION_HUMAN, {
      accountId: user.getAccountId(),
      position: { x, z, y: 0 },
    });
  },
};
