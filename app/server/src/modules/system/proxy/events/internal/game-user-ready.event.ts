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

    console.log(game.getManifest());
    if (game.getManifest().properties.kickFromCurrentRoom) {
      const $roomId = $user.getRoom();

      if ($roomId) {
        const room = await System.game.rooms.get($roomId);
        room.removeUser($user.getObject());
      }
    }

    game.addUser($user, clientId);
  },
};
