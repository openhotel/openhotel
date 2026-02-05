import { ProxyEventType } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";
import { Proxy } from "modules/proxy/main.ts";

export const gameUserRequestEvent: ProxyEventType<{
  gameId: string;
  accountId: string;
  token: string;
  ip: string;
}> = {
  event: ProxyEvent.$GAME_USER_REQUEST,
  func: ({ data: { gameId, accountId, token, ip } }) => {
    Proxy.core.game.setUserRequest({
      accountId,
      gameId,
      ip,
      token,
    });
  },
};
