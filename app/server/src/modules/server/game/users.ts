import { Point3d, PrivateUser, User, UserMutable } from "shared/types/main.ts";
import { Server } from "modules/server/main.ts";
import { ProxyEvent } from "shared/enums/event.enum.ts";
import { MOVEMENT_BETWEEN_TILES_DURATION } from "shared/consts/tiles.consts.ts";
import { TickerQueue } from "@oh/queue";

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
        for (const userId of Object.keys($userPathfindingMap)) {
          const user = get({ id: userId });
          const room = Server.game.rooms.get(user.getRoom());

          let nextPosition = $userPathfindingMap[userId].shift();
          if (!nextPosition) return;
          const targetPosition =
            $userPathfindingMap[userId][$userPathfindingMap[userId].length - 1];

          //check if targetPosition exists and if it's not free
          if (targetPosition && !room.isPointFree(nextPosition, user.getId())) {
            //calc new pathfinding
            const pathfinding = room.findPath(
              user.getPosition(),
              targetPosition,
              user.getId(),
            );

            //Path is not possible
            if (!pathfinding.length) {
              delete $userPathfindingMap[userId];
              return;
            }

            //set new pathfinding and next position
            $userPathfindingMap[userId] = pathfinding;
            nextPosition = $userPathfindingMap[userId].shift();
          }

          //check if next position is free
          if (!room.isPointFree(nextPosition, user.getId())) {
            delete $userPathfindingMap[userId];
            return;
          }

          //set next position (reserve it)
          user.setPosition(nextPosition);
          room.emit(ProxyEvent.MOVE_HUMAN, {
            userId: user.getId(),
            position: nextPosition,
          });

          //check if there's no more pathfinding
          if (!targetPosition) delete $userPathfindingMap[userId];
        }
      },
    });
  };

  const $getUser = (user: User): UserMutable => {
    if (!user) return null;

    const getId = () => user.id;
    const getUsername = () => user.username;

    const setPosition = (position: Point3d) => {
      $userMap[user.id].position = position;
      $userMap[user.id].positionUpdatedAt = performance.now();
    };
    const getPosition = (): Point3d => $userMap[user.id]?.position;
    const getPositionUpdatedAt = (): number =>
      $userMap[user.id].positionUpdatedAt;

    const setRoom = (roomId: string) => {
      $userMap[user.id].roomId = roomId;
      setPathfinding([]);
    };
    const getRoom = (): string => $userMap[user.id].roomId;
    const removeRoom = () => {
      setRoom(null);
      setPosition(null);
    };

    const setPathfinding = (path: Point3d[]) => {
      $userPathfindingMap[user.id] = path;
      if (!path.length) delete $userPathfindingMap[user.id];
    };
    const getPathfinding = (): Point3d[] => $userPathfindingMap[user.id] || [];

    const setLastMessage = (message: string) => {
      $userLastMessageMap[user.id] = message;
    };
    const getLastMessage = (): string => $userLastMessageMap[user.id];

    const getObject = (): User => $userMap[user.id];

    const disconnect = () =>
      Server.proxy.$emit(ProxyEvent.$DISCONNECT_USER, {
        clientId: $privateUserMap[user.id].clientId,
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
      getId,
      getUsername,

      setPosition,
      getPosition,
      getPositionUpdatedAt,

      setRoom,
      getRoom,
      removeRoom,

      setPathfinding,
      getPathfinding,

      setLastMessage,
      getLastMessage,

      getObject,

      disconnect,

      emit,
    };
  };

  const add = (user: User, privateUser: PrivateUser) => {
    $userMap[user.id] = user;
    $privateUserMap[privateUser.id] = privateUser;
  };

  const remove = (user: User) => {
    const $user = $getUser(user);
    if (!$user) return;

    const room = Server.game.rooms.get($user.getRoom());
    room.removeUser(user);

    delete $userMap[user.id];
    delete $privateUserMap[user.id];
    delete $userPathfindingMap[user.id];
  };

  const get = ({
    id,
    username,
  }: Partial<Pick<User, "id" | "username">>): UserMutable | null => {
    if (id) return $getUser($userMap[id]);
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
