import { CurrentUser, Point3d } from "shared/types";
import { System } from "system/system";
import { Event, SystemEvent } from "shared/enums";
import { isPosition3dEqual } from "shared/utils";

export const users = () => {
  let $user: CurrentUser;

  let $userMap: Record<string, Point3d> = {};

  const load = () => {
    System.proxy.on<any>(Event.REMOVE_HUMAN, ({ accountId }) => {
      delete $userMap[accountId];
    });
    System.proxy.on<any>(Event.MOVE_HUMAN, ({ accountId, position }) => {
      $userMap[accountId] = position;
    });
    System.proxy.on<any>(
      Event.SET_POSITION_HUMAN,
      ({ accountId, position }) => {
        $userMap[accountId] = position;
      },
    );
  };

  const setCurrentUser = (user: CurrentUser) => {
    $user = user;
    System.events.emit(SystemEvent.CURRENT_USER_SET, user);
  };

  const getCurrentUser = (): CurrentUser => ({
    ...$user,
    position: $userMap[$user.accountId],
  });

  const clear = () => {
    $userMap = {};
  };

  const get = (accountId: string) => $userMap[accountId];
  const getFromPoint = (point: Point3d) =>
    Object.keys($userMap).find(($userId) =>
      isPosition3dEqual(point, $userMap[$userId]),
    );

  return {
    load,
    clear,

    get,
    getFromPoint,

    setCurrentUser,
    getCurrentUser,
  };
};
