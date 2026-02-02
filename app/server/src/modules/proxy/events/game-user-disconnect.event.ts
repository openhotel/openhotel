import { ProxyEventType } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";
import { Proxy } from "modules/proxy/main.ts";

export const gameUserDisconnectEvent: ProxyEventType<{
  gameId: string;
  clientId: string;
}> = {
  event: ProxyEvent.$GAME_USER_DISCONNECT,
  func: ({ data: { gameId, clientId } }) => {
    Proxy.core.game.disconnectUser(gameId, clientId);
  },
};
