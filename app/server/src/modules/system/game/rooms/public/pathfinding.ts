import { System } from "modules/system/main.ts";
import { MOVEMENT_BETWEEN_TILES_DURATION } from "shared/consts/tiles.consts.ts";
import { TickerQueue } from "@oh/queue";
import { Point3d } from "@oh/utils";

export const pathfinding = () => {
  const $userPathfindingMap: Record<string, Point3d[]> = {};

  const load = () => {
    System.tasks.add({
      type: TickerQueue.REPEAT,
      repeatEvery: MOVEMENT_BETWEEN_TILES_DURATION,
      onFunc: async () => {
        for (const accountId of Object.keys($userPathfindingMap))
          await $doPathfinding(accountId);
      },
    });
  };

  const $doPathfinding = async (accountId: string) => {};

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
