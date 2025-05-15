import { ProxyEventType } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";
import { System } from "../../main.ts";

interface Props {
  gameId: string;
  event: string;
  data: any;
}

export const gameEvent: ProxyEventType<Props> = {
  event: ProxyEvent.GAME_EVENT,
  func: async ({ user, data }) => {
    const { gameId, event, data: eventData } = data;
    console.log({ gameId, event, eventData });

    const gameWorker = System.games.getWorker(gameId);
    if (!gameWorker) return;

    // TODO: avoid pass all user object
    gameWorker.emit("game:event", {
      event,
      user: {
        username: user.getUsername(),
      },
      data: eventData,
    });
  },
};
