import {
  PrivateUser,
  User,
  UserMutable,
  UsersConfig,
} from "shared/types/main.ts";
import { System } from "modules/system/main.ts";
import { ProxyEvent } from "shared/enums/event.enum.ts";
import { MOVEMENT_BETWEEN_TILES_DURATION } from "shared/consts/tiles.consts.ts";
import { Language } from "shared/enums/languages.enum.ts";
import { RoomPointEnum } from "shared/enums/room.enums.ts";
import { USERS_CONFIG_DEFAULT } from "shared/consts/users.consts.ts";
import { TickerQueue } from "@oh/queue";
import { Direction, getDirection, getConfig, Point3d } from "@oh/utils";
import { exists } from "deno/fs/mod.ts";

export const users = () => {
  let $privateUserMap: Record<string, PrivateUser> = {};
  let $userMap: Record<string, UserMutable> = {};

  let $userPathfindingMap: Record<string, Point3d[]> = {};
  let $userLastMessageMap: Record<string, string> = {};

  const load = async () => {
    System.tasks.add({
      type: TickerQueue.REPEAT,
      repeatEvery: MOVEMENT_BETWEEN_TILES_DURATION,
      onFunc: () => {
        for (const accountId of Object.keys($userPathfindingMap)) {
          const user = get({ accountId });
          const room = System.game.rooms.get(user.getRoom());

          let nextPosition = $userPathfindingMap[accountId].shift();
          if (!nextPosition) return;
          const targetPosition =
            $userPathfindingMap[accountId][
              $userPathfindingMap[accountId].length - 1
            ];

          //check if next position is spawn, exit <<
          if (room.getPoint(nextPosition) === RoomPointEnum.SPAWN) {
            room.removeUser(user.getObject());
            return;
          }

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

    // Check config file
    const config = await exists("./users.yml");
    if (!config) {
      await setConfig({
        op: {
          users: [],
        },
        blacklist: {
          active: false,
          users: [],
        },
        whitelist: {
          active: false,
          users: [],
        },
      });
    }
  };

  const $getUser = (user: User): UserMutable => {
    if (!user) return null;
    let $user: User = { ...user };

    const getId = () => user.accountId;
    const getUsername = () => user.username;

    const setPosition = (position: Point3d) => {
      $user.position = position;
      $user.positionUpdatedAt = performance.now();
    };
    const getPosition = (): Point3d => $user?.position;
    const getPositionUpdatedAt = (): number => $user.positionUpdatedAt;

    const setBodyDirection = (direction: Direction) => {
      $user.bodyDirection = direction;
    };
    const getBodyDirection = (): Direction => $user?.bodyDirection;

    const setRoom = (roomId: string) => {
      $user.roomId = roomId;
      delete $userPathfindingMap[user.accountId];
    };
    const getRoom = (): string => $user.roomId;
    const removeRoom = () => {
      setRoom(null);
      setPosition(null);
    };

    const setTargetPosition = (targetPosition: Point3d) => {
      const $room = System.game.rooms.get(getRoom());
      if (!$room) return;

      const pathfinding = $room.findPath(
        getPosition(),
        targetPosition,
        user.accountId,
      );

      //if not pf do nothing
      if (!pathfinding.length) {
        //target is spawn, exit <<
        if ($room.getPoint(targetPosition) === RoomPointEnum.SPAWN)
          return $room.removeUser(getObject());
        return;
      }

      $userPathfindingMap[user.accountId] = pathfinding;
    };

    const getPathfinding = (): Point3d[] =>
      $userPathfindingMap[user.accountId] || [];

    const setLastMessage = (message: string) => {
      $userLastMessageMap[user.accountId] = message;
    };
    const getLastMessage = (): string => $userLastMessageMap[user.accountId];

    const getObject = (): User => $user;

    const setLanguage = (language: Language) => {
      if (!Language[language.toUpperCase()]) return;
      $privateUserMap[user.accountId].language = language;
    };
    const getLanguage = () =>
      $privateUserMap[user.accountId].language ?? Language.EN;

    const disconnect = () =>
      System.proxy.$emit(ProxyEvent.$DISCONNECT_USER, {
        clientId: $privateUserMap[user.accountId].clientId,
      });

    const emit = <Data extends any>(
      event: ProxyEvent,
      data: Data = {} as Data,
    ) =>
      System.proxy.emit({
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

      setTargetPosition,

      // setPathfinding,
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
    $userMap[user.accountId] = $getUser(user);
    $privateUserMap[privateUser.accountId] = privateUser;
  };

  const remove = (user: User) => {
    const $user = $userMap[user.accountId];
    if (!$user) return;

    const room = System.game.rooms.get($user.getRoom());
    room?.removeUser($user.getObject());

    delete $userMap[user.accountId];
    delete $privateUserMap[user.accountId];
    delete $userPathfindingMap[user.accountId];
  };

  const get = ({
    accountId,
    username,
  }: Partial<Pick<User, "accountId" | "username">>): UserMutable | null => {
    if (accountId) return $userMap[accountId];
    if (username)
      return getList().find((user) => user.getUsername() === username);
    return null;
  };

  const getList = () => Object.values($userMap);
  const $getConfig = (): Promise<UsersConfig> => {
    return getConfig<UsersConfig>({
      defaults: USERS_CONFIG_DEFAULT,
      fileName: "users.yml",
    });
  };
  const setConfig = async (config: UsersConfig): Promise<void> => {
    await getConfig<UsersConfig>({
      values: config,
      defaults: USERS_CONFIG_DEFAULT,
      fileName: "users.yml",
    });
  };

  return {
    load,
    add,
    remove,
    get,
    getList,

    getConfig: $getConfig,
    setConfig,

    $userMap,
  };
};
