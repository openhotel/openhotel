import { PrivateUser, ProxyEventType } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";
import { System } from "modules/system/main.ts";

export const gameUserReadyEvent: ProxyEventType<{
  user: PrivateUser;
  gameId: string;
  clientId: string;
}> = {
  event: ProxyEvent.$GAME_USER_READY,
  func: async ({ data: { user, gameId, clientId } }) => {
    const game = System.game.games.getGame(gameId);
    const $user = System.game.users.get({ accountId: user.accountId });

    game.setUserReady($user, clientId);
  },
};
