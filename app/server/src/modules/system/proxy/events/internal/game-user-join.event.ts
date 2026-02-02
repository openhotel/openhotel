import { PrivateUser, ProxyEventType } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";
import { System } from "modules/system/main.ts";

export const gameUserJoinEvent: ProxyEventType<{
  user: PrivateUser;
  gameId: string;
  clientId: string;
}> = {
  event: ProxyEvent.$GAME_USER_JOIN,
  func: async ({ data: { user, gameId, clientId } }) => {
    const game = System.game.games.getGame(gameId);
    const $user = System.game.users.get({ accountId: user.accountId });

    const settings = await game.getSettings();

    if (settings.kickFromCurrentRoom) {
      // const $roomId = $user.getRoom();
      //
      // if ($roomId) {
      //   const room = await System.game.rooms.get($roomId);
      //   room.removeUser($user.getObject());
      // }
    }

    $user.setGame(gameId, clientId);
    game.addUser($user);
  },
};
