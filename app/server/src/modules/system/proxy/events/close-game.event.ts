import { ProxyEventType } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";
import { System } from "modules/system/main.ts";

export const closeGameEvent: ProxyEventType = {
  event: ProxyEvent.CLOSE_GAME,
  func: async ({ user }) => {
    const gameId = user.getGame();
    if (!gameId) return;

    const game = System.game.games.getGame(gameId);
    if (!game) return;

    game.removeUser(user);
    user.removeGame();
  },
};
