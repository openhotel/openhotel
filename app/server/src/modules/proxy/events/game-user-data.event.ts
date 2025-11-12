import { ProxyEventType } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";
import { Proxy } from "modules/proxy/main.ts";

export const gameUserDataEvent: ProxyEventType<{
  gameId: string;
  clientId: string;
  event: string;
  message: any;
}> = {
  event: ProxyEvent.$GAME_USER_DATA,
  func: ({ data: { gameId, clientId, event, message } }) => {
    console.log(gameId, clientId, event, message);
    Proxy.core.game.emitUser(gameId, clientId, event, message);
  },
};
