import { ProxyEventType } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";
import { Server } from "modules/server/main.ts";
import { isPoint3dEqual } from "shared/utils/main.ts";
import { MOVEMENT_BETWEEN_TILES_DURATION } from "shared/consts/main.ts";

export const nextPathTileEvent: ProxyEventType<any> = {
  event: ProxyEvent.NEXT_PATH_TILE,
  func: async ({ data: { position }, user }) => {
    const $room = Server.game.rooms.get(user.getRoom());

    if (!$room) return;

    //cannot be like the last one
    if (isPoint3dEqual(user.getPosition(), position)) return;

    const positionUpdateInterval =
      performance.now() - user.getPositionUpdatedAt();
    //TODO check if time makes sense
    if (MOVEMENT_BETWEEN_TILES_DURATION > positionUpdateInterval) {
      //cheating 99%
      console.log("CHEATER!");
      return user.disconnect();
    }

    const pathfinding = user.getPathfinding();
    const nextPosition = pathfinding.shift();

    //check if next position is the targeted one
    if (!isPoint3dEqual(nextPosition, position)) return user.disconnect();

    user.setPosition(nextPosition);
  },
};
