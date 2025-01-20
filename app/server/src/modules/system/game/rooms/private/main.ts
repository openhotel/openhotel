import {
  FindPathProps,
  PrivateRoom,
  RoomFurniture,
  PrivateRoomMutable,
  RoomPoint,
  User,
} from "shared/types/main.ts";
import { FurnitureType, ProxyEvent, RoomPointEnum } from "shared/enums/main.ts";
import { System } from "modules/system/main.ts";
import { getInterpolatedPath } from "shared/utils/pathfinding.utils.ts";
import { WALKABLE_FURNITURE_TYPE } from "shared/consts/main.ts";
import { Direction, getRandomNumber, isPoint3dEqual, Point3d } from "@oh/utils";
import { Grid } from "@oh/pathfinding";
import { getBaseRoomGrid } from "shared/utils/rooms.utils.ts";
import { pathfinding } from "./pathfinding.ts";

const getRoom =
  (roomUserMap: Record<string, string[]>, $pathfinding) =>
  (room: PrivateRoom): PrivateRoomMutable => {
    let $room: PrivateRoom = { ...room };

    if (!roomUserMap[room.id]) roomUserMap[room.id] = [];

    const $baseRoomGrid: RoomPoint[][] = getBaseRoomGrid($room.layout);

    const getId = () => room.id;
    const getTitle = () => room.title;
    const getDescription = () => room.description;

    const getOwnerId = () => $room.ownerId;
    const getOwnerUsername = async (): Promise<string | null> => {
      const user = await System.game.users.getCacheUser(getOwnerId());
      if (!user) return null;
      return user.username;
    };

    const getSpawnPoint = (): Point3d => room.spawnPoint;
    const getSpawnDirection = (): Direction => room.spawnDirection;

    const addUser = async (user: User, position?: Point3d) => {
      const $user = System.game.users.get({ accountId: user.accountId });
      if (!$user) return;

      let startPosition = getSpawnPoint();
      if (position) {
        startPosition = { x: position.x, y: 0, z: position.z };
        startPosition.y = getYFromPoint(startPosition);
      }

      $user.setRoom(room.id);
      $user.setPosition(startPosition);
      $user.setBodyDirection(getSpawnDirection());

      //Add user to "room" internally
      System.proxy.$emit(ProxyEvent.$ADD_ROOM, {
        accountId: $user.getAccountId(),
        roomId: getId(),
      });

      //Load room to user
      $user.emit(ProxyEvent.LOAD_ROOM, {
        room: {
          ...getObject(),
          ownerUsername: await getOwnerUsername(),
        },
      });

      //Add user to room
      emit(ProxyEvent.ADD_HUMAN, { user: $user.getObject() });

      //Send every existing user inside room to the user
      for (const accountId of getUsers()) {
        const user = System.game.users.get({ accountId });
        if (!user) continue;

        $user.emit(ProxyEvent.ADD_HUMAN, {
          user: user.getObject(),
          isOld: true,
        });
      }

      roomUserMap[room.id].push($user.getAccountId());
    };
    const removeUser = (user: User, moveToAnotherRoom: boolean = false) => {
      const $user = System.game.users.get({ accountId: user.accountId });
      if (!$user) return;

      const $accountId = $user.getAccountId();

      $pathfinding.remove(user.accountId);

      $user.removeRoom();

      roomUserMap[room.id] = roomUserMap[room.id].filter(
        (accountId) => accountId !== $accountId,
      );

      //Remove user from internal "room"
      System.proxy.$emit(ProxyEvent.$REMOVE_ROOM, {
        accountId: $accountId,
        roomId: room.id,
      });
      //Disconnect user from current room
      $user.emit(ProxyEvent.LEAVE_ROOM, { moveToAnotherRoom });
      //Remove user human from the room to existing users
      emit(ProxyEvent.REMOVE_HUMAN, { accountId: $user.getAccountId() });
    };
    const getUsers = () => roomUserMap[room.id];

    const getPoint = (position: Point3d) =>
      room.layout?.[position.z]?.[position.x];

    const isPointFree = (position: Point3d, accountId?: string) => {
      if (getPoint(position) === RoomPointEnum.EMPTY) return false;
      if (getPoint(position) === RoomPointEnum.SPAWN) return true;

      return Boolean(
        !getUsers()
          .filter(($accountId) => !accountId || $accountId !== accountId)
          .find(($accountId) => {
            const user = System.game.users.get({ accountId: $accountId });
            return isPoint3dEqual(user.getPosition(), position, true);
          }) &&
          Boolean(
            !getFurniture()
              .filter(
                (furniture) =>
                  !WALKABLE_FURNITURE_TYPE.includes(furniture.type),
              )
              .find((furniture) =>
                isPoint3dEqual(furniture.position, position),
              ),
          ),
      );
    };

    const findPath = ({ start, end, accountId }: FindPathProps) => {
      const roomLayout = structuredClone($baseRoomGrid);
      const roomUsers = getUsers().map(($accountId) =>
        System.game.users.get({ accountId: $accountId }),
      );

      for (const user of roomUsers) {
        if (!user) continue;
        //ignore current user
        if (accountId && user?.getAccountId() === accountId) continue;

        const position = user.getPosition();

        //ignore if a human is in the same position of you because x (teleports, tp...)
        if (isPoint3dEqual(position, start)) continue;

        //if spawn, ignore
        if (getPoint(position) === RoomPointEnum.SPAWN) continue;

        //if is occupied, set as empty
        roomLayout[position.z][position.x] = RoomPointEnum.EMPTY;
      }

      for (const furniture of getFurniture()) {
        if (WALKABLE_FURNITURE_TYPE.includes(furniture.type)) continue;
        const position = furniture.position;
        //ignore if a human is in the same position of furniture because x (chairs, teleports, tp...)
        if (isPoint3dEqual(position, start)) continue;

        roomLayout[position.z][position.x] = RoomPointEnum.EMPTY;
      }

      const grid = Grid.from(roomLayout);

      const path = grid
        .findPath(
          { x: start.x, y: start.z },
          { x: end.x, y: end.z },
          { maxJumpCost: 5, jumpBlockedDiagonals: true },
        )
        .map(({ x, y }) => ({
          x,
          z: y,
        }));

      const pathfinding = getInterpolatedPath(path).map(({ x, z }) => ({
        x,
        y: getYFromPoint({ x, z }),
        z,
      }));
      //discard first (current position)
      pathfinding.shift();
      return pathfinding;
    };

    const addFurniture = async (furniture: RoomFurniture) => {
      furniture.position = {
        ...furniture.position,
        y: getYFromPoint(furniture.position),
      };
      $room.furniture.push(furniture);

      await $save();
    };
    const updateFurniture = async (furniture: RoomFurniture) => {
      furniture.position = {
        ...furniture.position,
        y: getYFromPoint(furniture.position),
      };
      $room.furniture = $room.furniture.map(($furniture) =>
        furniture.id === $furniture.id ? furniture : $furniture,
      );

      await $save();
    };
    const removeFurniture = async (furniture: RoomFurniture) => {
      $room.furniture = $room.furniture.filter((f) => f.id !== furniture.id);

      if (furniture.type === FurnitureType.TELEPORT)
        await System.game.teleports.removeRoom(furniture.id);

      await $save();
    };
    const getFurniture = (): RoomFurniture[] => $room.furniture;

    const getYFromPoint = (point: Partial<Point3d>): number | null => {
      if (!room?.layout?.[point.z]) return null;
      const roomPoint = room.layout?.[point.z]?.[point.x];

      if (roomPoint === RoomPointEnum.EMPTY) return null;
      if (roomPoint === RoomPointEnum.SPAWN) return 0;

      const onStairs =
        room?.layout?.[point.z] &&
        (roomPoint > room?.layout?.[point.z]?.[point.x - 1] ||
          roomPoint > room?.layout?.[point.z - 1]?.[point.x]);

      return -(parseInt(roomPoint + "") - 1) + (onStairs ? 0.5 : 0);
    };

    const getObject = () => $room;

    const emit = <Data extends any>(
      event: ProxyEvent,
      data: Data = {} as Data,
    ) =>
      System.proxy.emitRoom({
        event,
        roomId: getId(),
        data,
      });

    const $save = async () => {
      await System.db.set(["rooms", "private", $room.id], $room);
    };

    return {
      type: "private",

      getId,
      getTitle,
      getDescription,

      getOwnerId,
      getOwnerUsername,

      addUser,
      removeUser,
      getUsers,

      getPoint,
      isPointFree,
      findPath,

      addFurniture,
      updateFurniture,
      removeFurniture,
      getFurniture,

      getObject,

      emit,
    };
  };

export const $private = () => {
  let roomUserMap: Record<string, string[]> = {};

  const $pathfinding = pathfinding();

  const $getRoom = getRoom(roomUserMap, $pathfinding);

  const load = () => {
    $pathfinding.load();
  };

  const get = async (roomId: string): Promise<PrivateRoomMutable | null> => {
    try {
      const roomData = await System.db.get(["rooms", "private", roomId]);
      if (!roomData) return null;
      return $getRoom(roomData);
    } catch (e) {
      return null;
    }
  };

  const getList = async (): Promise<PrivateRoomMutable[]> => {
    return (await System.db.list({ prefix: ["rooms", "private"] })).map(
      (item) => $getRoom(item.value),
    );
  };

  const getByName = async (
    name: string,
  ): Promise<PrivateRoomMutable | null> => {
    const roomList = await getList();
    return roomList.find((room) => room.getTitle() === name) || null;
  };

  const getRandom = async (): Promise<PrivateRoomMutable> => {
    const roomList = await getList();
    const roomIndex = getRandomNumber(0, roomList.length - 1);
    return roomList[roomIndex];
  };

  const add = async (room: PrivateRoom) => {
    await System.db.set(["rooms", "private", room.id], room);
  };
  return {
    load,

    get,
    getList,
    getByName,

    getRandom,

    pathfinding: $pathfinding,

    add,
  };
};
