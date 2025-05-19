import { System } from "modules/system/main.ts";
import { MOVEMENT_BETWEEN_TILES_DURATION } from "shared/consts/tiles.consts.ts";
import { TickerQueue } from "@oh/queue";
import { Point3d, getDirection } from "@oh/utils";
import { RoomPointEnum } from "shared/enums/room.enums.ts";
import { ProxyEvent } from "shared/enums/event.enum.ts";

export const pathfinding = () => {
  const $userPathfindingMap: Record<string, Point3d[]> = {};

  const load = () => {
    //TODO this needs to be moved to workers
    System.tasks.add({
      type: TickerQueue.REPEAT,
      repeatEvery: MOVEMENT_BETWEEN_TILES_DURATION,
      onFunc: async () => {
        for (const accountId of Object.keys($userPathfindingMap))
          await $doPathfinding(accountId);
      },
    });
  };

  const $doPathfinding = async (accountId: string) => {
    const user = System.game.users.get({ accountId });
    const room = await System.game.rooms.get(user.getRoom());

    let nextPosition = $userPathfindingMap[accountId].shift();
    if (!nextPosition) return;
    const targetPosition =
      $userPathfindingMap[accountId][$userPathfindingMap[accountId].length - 1];

    //check if next position is spawn, exit <<
    if (room.getPoint(nextPosition) === RoomPointEnum.SPAWN) {
      room.removeUser(user.getObject());
      return;
    }

    //check if targetPosition exists and if it's not free
    if (
      targetPosition &&
      !room?.isPointFree(nextPosition, { accountId: user.getAccountId() })
    ) {
      //calc new pathfinding
      const pathfinding = room?.findPath({
        start: user.getPosition(),
        end: targetPosition,
        accountId: user.getAccountId(),
      });

      //Path is not possible
      if (!pathfinding.length) {
        //if target position is spawn, exit <<
        if (room.getPoint(targetPosition) === RoomPointEnum.SPAWN) {
          room.removeUser(user.getObject());
          return;
        }

        delete $userPathfindingMap[accountId];
        return;
      }

      //set new pathfinding and next position
      $userPathfindingMap[accountId] = pathfinding;
      nextPosition = $userPathfindingMap[accountId].shift();
    }

    //check if next position is free
    if (!room.isPointFree(nextPosition, { accountId: user.getAccountId() })) {
      delete $userPathfindingMap[accountId];
      return;
    }

    const targetBodyDirection = getDirection(user.getPosition(), nextPosition);
    //set next position (reserve it)
    user.setPosition(nextPosition);
    user.setBodyDirection(targetBodyDirection);
    room.emit(ProxyEvent.MOVE_HUMAN, {
      accountId: user.getAccountId(),
      position: nextPosition,
      bodyDirection: targetBodyDirection,
    });

    //check if there's no more pathfinding
    if (!targetPosition) delete $userPathfindingMap[accountId];
  };

  const set = (accountId: string, pathfinding: Point3d[]) => {
    $userPathfindingMap[accountId] = pathfinding;
  };

  const remove = (accountId: string) => {
    delete $userPathfindingMap[accountId];
  };

  const get = (accountId: string): Point3d[] => $userPathfindingMap[accountId];

  return {
    load,

    set,
    remove,
    get,
  };
};
