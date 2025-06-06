import { ProxyEventType } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";
import { Proxy } from "modules/proxy/main.ts";

export const gameGuestCheckEvent: ProxyEventType<{
  gameId: string;
  accountId: string;
  valid: boolean;
}> = {
  event: ProxyEvent.$GAME_GUEST_CHECK,
  func: ({ data: { gameId, accountId, valid } }) => {
    Proxy.core.game.setGameCheckValidity(gameId, accountId, valid);
  },
};
