import { PrivateUser, ProxyEventType } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";
import { System } from "modules/system/main.ts";

export const gameUserDataEvent: ProxyEventType<{
  user: PrivateUser;
  gameId: string;
  clientId: string;
  event: string;
  message: any;
}> = {
  event: ProxyEvent.$GAME_USER_DATA,
  func: async ({ data: { user, gameId, clientId, event, message } }) => {
    const game = System.game.games.getGame(gameId);

    game.emit("USER_DATA", {
      clientId,
      accountId: user.accountId,
      event,
      message,
      d: performance.now(),
    });
  },
};
