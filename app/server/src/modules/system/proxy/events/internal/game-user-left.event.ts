import { PrivateUser, ProxyEventType } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";
import { System } from "modules/system/main.ts";

export const gameUserLeftEvent: ProxyEventType<{
  user: PrivateUser;
  gameId: string;
  clientId: string;
}> = {
  event: ProxyEvent.$GAME_USER_LEFT,
  func: async ({ data: { user, gameId } }) => {
    const game = System.game.games.getGame(gameId);
    const $user = System.game.users.get({ accountId: user?.accountId });

    if (!$user) return;

    $user.removeGame();
    game.removeUser($user);

    $user.emit(ProxyEvent.REMOVE_GAME, {
      gameId: game.getGameId(),
    });
  },
};
