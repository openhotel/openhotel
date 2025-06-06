import { ProxyEventType } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";
import { System } from "modules/system/main.ts";

export const gameGuestCheckEvent: ProxyEventType<{
  gameId: string;
  accountId: string;
  token: string;
}> = {
  event: ProxyEvent.$GAME_GUEST_CHECK,
  func: async ({ data: { gameId, accountId, token } }) => {
    const sendResponse = (valid: boolean) =>
      System.proxy.$emit(ProxyEvent.$GAME_GUEST_CHECK, {
        gameId,
        accountId,
        valid,
      });

    const foundGame = System.game.games.getGame(gameId);

    sendResponse(foundGame && foundGame.getToken(accountId) === token);
  },
};
