import {
  CacheUser,
  Furniture,
  Contract,
  PrivateRoomMutable,
  PrivateUser,
  Transaction,
  User,
  UserMutable,
  UsersConfig,
} from "shared/types/main.ts";
import { System } from "modules/system/main.ts";
import { ProxyEvent } from "shared/enums/event.enum.ts";
import { RoomPointEnum } from "shared/enums/room.enums.ts";
import { USERS_CONFIG_DEFAULT } from "shared/consts/users.consts.ts";
import { Direction, getConfig, Point3d } from "@oh/utils";
import { exists } from "deno/fs/mod.ts";
import { log as $log } from "shared/utils/log.utils.ts";
import { UserAction } from "shared/enums/user.enums.ts";
import { INITIAL_PLAYER_BALANCE } from "shared/consts/economy.consts.ts";

export const users = () => {
  let $privateUserMap: Record<string, PrivateUser> = {};
  let $userMap: Record<string, UserMutable> = {};

  // let $userPathfindingMap: Record<string, Point3d[]> = {};
  let $userLastMessageMap: Record<string, string> = {};
  let $userLastWhisperMap: Record<string, string> = {};

  const load = async () => {
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

    let $userAction: UserAction | null = null;

    const getAccountId = () => user.accountId;
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
      $clearPathfinding();
      $user.roomId = roomId;
    };
    const getRoom = (): string => $user.roomId;
    const removeRoom = () => {
      setRoom(null);
      setPosition(null);
      setLastWhisper(null);
    };

    const $clearPathfinding = () => {
      System.game.rooms.pathfinding.remove(getAccountId());
    };

    const setAction = (action: UserAction | null) => {
      $userAction = action;
    };
    const getAction = () => $userAction;

    const preMoveToRoom = async (roomId: string) => {
      const foundRoom = await System.game.rooms.get(roomId);

      const room =
        foundRoom.type === "public"
          ? {
              id: foundRoom.getId(),
              type: "public",
            }
          : {
              id: foundRoom.getId(),
              type: "private",
              furniture: (foundRoom as PrivateRoomMutable).getFurniture(),
            };

      emit(ProxyEvent.PRE_JOIN_ROOM, {
        room,
      });
    };

    const moveToRoom = async (roomId: string) => {
      const currentRoom = getRoom();

      setLastMessage(null);

      if (currentRoom) {
        const room = await System.game.rooms.get(currentRoom);
        room?.removeUser?.(getObject(), true);
      }

      const targetRoom = await System.game.rooms.get(roomId);
      await targetRoom?.addUser?.(getObject());
    };

    const setTargetPosition = async (targetPosition: Point3d) => {
      const $room = await System.game.rooms.get(getRoom());
      if (!$room) return;

      const pathfinding = $room.findPath({
        start: getPosition(),
        end: targetPosition,
        accountId: user.accountId,
      });

      //if not pf do nothing
      if (!pathfinding.length) {
        //target is spawn, exit <<
        if ($room.getPoint(targetPosition) === RoomPointEnum.SPAWN)
          return $room.removeUser(getObject());
        return;
      }

      System.game.rooms.pathfinding.set(getAccountId(), pathfinding);
    };

    const getPathfinding = (): Point3d[] =>
      System.game.rooms.pathfinding.get(getAccountId()) || [];

    const setLastMessage = (message: string | null) => {
      $userLastMessageMap[user.accountId] = message;
    };
    const getLastMessage = (): string | null =>
      $userLastMessageMap[user.accountId];

    const setLastWhisper = (whisperUser: UserMutable | null) => {
      $userLastWhisperMap[user.accountId] = whisperUser
        ? whisperUser.getAccountId()
        : null;
    };
    const getLastWhisper = (): UserMutable | null => {
      const accountId = $userLastWhisperMap[user.accountId];
      if (!accountId) return null;
      return get({ accountId });
    };

    const getObject = (): User => $user;

    const getMeta = () => $user.meta ?? null;

    const isOP = async () =>
      System.auth.getOwnerId() === user.accountId ||
      $privateUserMap[user.accountId].admin ||
      (await $getConfig()).op.users.includes(getUsername());

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
        users: getAccountId(),
        data,
      });

    const log = async (...data: string[]) => {
      const createdAt = Date.now();
      const accountId = getAccountId();
      await System.db.set(["usersLogs", accountId, createdAt], {
        accountId,
        createdAt,
        data,
      });
      $log(`${getUsername()} ${data.join(" ")}`);
    };

    const getCredits = async (): Promise<number> => {
      const accountId = getAccountId();
      return System.db.get(["users", accountId, "balance"]);
    };

    const getTransactions = async (): Promise<Transaction[]> => {
      const accountId = getAccountId();
      const { items } = await System.db.list({
        prefix: ["transactionsByUser", accountId],
      });

      return items.map((item) => item.value);
    };

    const getContracts = async (): Promise<Contract[]> => {
      const accountId = getAccountId();
      const contracts: string[] = await System.db.get([
        "contractsByUser",
        accountId,
      ]);
      if (!contracts) return [];

      return Promise.all(
        contracts.map((companyId) =>
          System.db.get(["contracts", companyId, accountId]),
        ),
      );
    };

    const addFurniture = async (
      furnitureId: string,
      id: string,
    ): Promise<void> => {
      const accountId = getAccountId();
      return System.db.set(["users", accountId, "inventory", id], {
        furnitureId,
        id,
      } as Furniture);
    };

    const removeFurniture = async (id: string): Promise<void> => {
      const accountId = getAccountId();
      return System.db.delete(["users", accountId, "inventory", id]);
    };

    const getFurniture = async (id: string): Promise<Furniture> => {
      const accountId = getAccountId();
      return System.db.get(["users", accountId, "inventory", id]);
    };

    const getInventory = async (): Promise<Furniture[]> => {
      const accountId = getAccountId();
      const { items } = await System.db.list({
        prefix: ["users", accountId, "inventory"],
      });

      return await Promise.all(
        items
          .map((item) => item.value as Furniture)
          .map(async (furniture) => {
            const data = await System.game.furniture.get(furniture.furnitureId);
            return {
              ...furniture,
              type: data.type,
            };
          }),
      );
    };

    return {
      getAccountId,
      getUsername,

      setPosition,
      getPosition,
      getPositionUpdatedAt,

      setBodyDirection,
      getBodyDirection,

      setRoom,
      getRoom,
      removeRoom,

      setAction,
      getAction,

      preMoveToRoom,
      moveToRoom,

      setTargetPosition,

      // setPathfinding,
      getPathfinding,

      setLastMessage,
      getLastMessage,

      setLastWhisper,
      getLastWhisper,

      getObject,

      disconnect,

      getMeta,

      isOp: isOP,

      emit,

      log,

      getCredits,
      getTransactions,
      getContracts,

      addFurniture,
      removeFurniture,
      getFurniture,
      getInventory,
    };
  };

  const add = async (user: User, privateUser: PrivateUser) => {
    const $user = $getUser(user);
    $userMap[user.accountId] = $user;

    $privateUserMap[privateUser.accountId] = privateUser;

    await System.db.set(["users", user.accountId], {
      accountId: user.accountId,
      username: user.username,
    });
    await System.db.set(["usersByUsername", user.username], user.accountId);
    const credits = await $user.getCredits();
    if (credits === null) {
      await System.db.set(
        ["users", user.accountId, "balance"],
        INITIAL_PLAYER_BALANCE,
      );
    }

    await $user.log("joined");
  };

  const remove = async (user: User) => {
    const $user = $userMap[user.accountId];
    if (!$user) return;

    const room = await System.game.rooms.get($user.getRoom());
    room?.removeUser($user.getObject());

    delete $userMap[user.accountId];
    delete $privateUserMap[user.accountId];

    await $user.log("left");
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

  const getCacheUser = async (accountId: string): Promise<CacheUser | null> =>
    await System.db.get(["users", accountId]);

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

    getCacheUser,

    getConfig: $getConfig,
    setConfig,

    $userMap,
  };
};
