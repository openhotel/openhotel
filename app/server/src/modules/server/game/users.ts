import { Point3d, PrivateUser, User, UserMutable } from "shared/types/main.ts";
import { Server } from "modules/server/main.ts";
import { ProxyEvent } from "shared/enums/event.enum.ts";
import { MOVEMENT_BETWEEN_TILES_DURATION } from "shared/consts/tiles.consts.ts";
import { TickerQueue } from "@oh/queue";
import { getDirection } from "shared/utils/main.ts";
import { Direction } from "shared/enums/direction.enums.ts";
import { Language } from "shared/enums/languages.enum.ts";

export const users = () => {
  let $privateUserMap: Record<string, PrivateUser> = {};
  let $userMap: Record<string, User> = {};

  let $userPathfindingMap: Record<string, Point3d[]> = {};
  let $userLastMessageMap: Record<string, string> = {};

  const load = () => {
    Server.tasks.add({
      type: TickerQueue.REPEAT,
      repeatEvery: MOVEMENT_BETWEEN_TILES_DURATION,
      onFunc: () => {
        for (const accountId of Object.keys($userPathfindingMap)) {
          const user = get({ accountId });
          const room = Server.game.rooms.get(user.getRoom());

          let nextPosition = $userPathfindingMap[accountId].shift();
          if (!nextPosition) return;
          const targetPosition =
            $userPathfindingMap[accountId][
              $userPathfindingMap[accountId].length - 1
            ];

          //check if targetPosition exists and if it's not free
          if (
            targetPosition &&
            !room?.isPointFree(nextPosition, user.getAccountId())
          ) {
            //calc new pathfinding
            const pathfinding = room?.findPath(
              user.getPosition(),
              targetPosition,
              user.getAccountId(),
            );

            //Path is not possible
            if (!pathfinding.length) {
              delete $userPathfindingMap[accountId];
              return;
            }

            //set new pathfinding and next position
            $userPathfindingMap[accountId] = pathfinding;
            nextPosition = $userPathfindingMap[accountId].shift();
          }

          //check if next position is free
          if (!room.isPointFree(nextPosition, user.getAccountId())) {
            delete $userPathfindingMap[accountId];
            return;
          }

          const targetBodyDirection = getDirection(
            user.getPosition(),
            nextPosition,
          );
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
        }
      },
    });
  };

  const $getUser = (user: User): UserMutable => {
    if (!user) return null;

    const getId = () => user.accountId;
    const getUsername = () => user.username;

    const setPosition = (position: Point3d) => {
      $userMap[user.accountId].position = position;
      $userMap[user.accountId].positionUpdatedAt = performance.now();
    };
    const getPosition = (): Point3d => $userMap[user.accountId]?.position;
    const getPositionUpdatedAt = (): number =>
      $userMap[user.accountId].positionUpdatedAt;

    const setBodyDirection = (direction: Direction) => {
      $userMap[user.accountId].bodyDirection = direction;
    };
    const getBodyDirection = (): Direction =>
      $userMap[user.accountId]?.bodyDirection;

    const setRoom = (roomId: string) => {
      $userMap[user.accountId].roomId = roomId;
      setPathfinding([]);
    };
    const getRoom = (): string => $userMap[user.accountId].roomId;
    const removeRoom = () => {
      setRoom(null);
      setPosition(null);
    };

    const setPathfinding = (path: Point3d[]) => {
      $userPathfindingMap[user.accountId] = path;
      if (!path?.length) delete $userPathfindingMap[user.accountId];
    };
    const getPathfinding = (): Point3d[] =>
      $userPathfindingMap[user.accountId] || [];

    const setLastMessage = (message: string) => {
      $userLastMessageMap[user.accountId] = message;
    };
    const getLastMessage = (): string => $userLastMessageMap[user.accountId];

    const getObject = (): User => $userMap[user.accountId];

    const setLanguage = (language: Language) => {
      if (!Language[language.toUpperCase()]) return;
      $privateUserMap[user.accountId].language = language;
    };
    const getLanguage = () => $privateUserMap[user.accountId].language ?? "en";

    const disconnect = () =>
      Server.proxy.$emit(ProxyEvent.$DISCONNECT_USER, {
        clientId: $privateUserMap[user.accountId].clientId,
      });

    const emit = <Data extends any>(
      event: ProxyEvent,
      data: Data = {} as Data,
    ) =>
      Server.proxy.emit({
        event,
        users: getId(),
        data,
      });

    return {
      getAccountId: getId,
      getUsername,

      setPosition,
      getPosition,
      getPositionUpdatedAt,

      setBodyDirection,
      getBodyDirection,

      setRoom,
      getRoom,
      removeRoom,

      setPathfinding,
      getPathfinding,

      setLastMessage,
      getLastMessage,

      getObject,

      disconnect,

      setLanguage,
      getLanguage,

      emit,
    };
  };

  const add = (user: User, privateUser: PrivateUser) => {
    $userMap[user.accountId] = user;
    $privateUserMap[privateUser.accountId] = privateUser;
  };

  const remove = (user: User) => {
    const $user = $getUser(user);
    if (!$user) return;

    const room = Server.game.rooms.get($user.getRoom());
    room?.removeUser(user);

    delete $userMap[user.accountId];
    delete $privateUserMap[user.accountId];
    delete $userPathfindingMap[user.accountId];
  };

  const get = ({
    accountId,
    username,
  }: Partial<Pick<User, "accountId" | "username">>): UserMutable | null => {
    if (accountId) return $getUser($userMap[accountId]);
    if (username)
      return getAll().find((user) => user.getUsername() === username);
    return null;
  };

  const getAll = () => Object.values($userMap).map($getUser);

  return {
    load,
    add,
    remove,
    get,
    getAll,
  };
};
