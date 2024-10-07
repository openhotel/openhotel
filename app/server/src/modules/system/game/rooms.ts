import {
  Point3d,
  RawRoom,
  Room,
  RoomFurniture,
  RoomMutable,
  RoomPoint,
  User,
} from "shared/types/main.ts";
import {
  Direction,
  FurnitureType,
  ProxyEvent,
  RoomPointEnum,
} from "shared/enums/main.ts";
import { System } from "modules/system/main.ts";
import { getInterpolatedPath } from "shared/utils/pathfinding.utils.ts";
import { getRandomNumber } from "shared/utils/random.utils.ts";
import { isPoint3dEqual } from "shared/utils/point.utils.ts";
import {
  getRoomGridLayout,
  getRoomSpawnDirection,
  getRoomSpawnPoint,
} from "shared/utils/rooms.utils.ts";
import { DEFAULT_ROOMS } from "shared/consts/main.ts";
import { log } from "shared/utils/main.ts";

export const rooms = () => {
  let roomMap: Record<string, RoomMutable> = {};
  let roomUserMap: Record<string, string[]> = {};

  const $getRoom = (room: Room): RoomMutable => {
    let $room: Room = { ...room };

    const getId = () => room.id;
    const getTitle = () => room.title;
    const getDescription = () => room.description;

    const getSpawnPoint = (): Point3d => room.spawnPoint;
    const getSpawnDirection = (): Direction => room.spawnDirection;

    const addUser = (user: User) => {
      const $user = System.game.users.get({ accountId: user.accountId });
      if (!$user) return;

      $user.setRoom(room.id);
      $user.setPosition(getSpawnPoint());
      $user.setBodyDirection(getSpawnDirection());

      //Add user to "room" internally
      System.proxy.$emit(ProxyEvent.$ADD_ROOM, {
        accountId: $user.getAccountId(),
        roomId: getId(),
      });

      //Load room to user
      $user.emit(ProxyEvent.LOAD_ROOM, { room: getObject() });

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
    const removeUser = (user: User) => {
      const $user = System.game.users.get({ accountId: user.accountId });
      if (!$user) return;

      const $accountId = $user.getAccountId();

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
      $user.emit(ProxyEvent.LEAVE_ROOM);
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
            !getFurnitures()
              .filter((furniture) => furniture.type !== FurnitureType.FRAME)
              .find((furniture) =>
                isPoint3dEqual(furniture.position, position),
              ),
          ),
      );
    };

    const findPath = (start: Point3d, end: Point3d, accountId?: string) => {
      const roomLayout = structuredClone(room.layout);
      const roomUsers = getUsers().map(($accountId) =>
        System.game.users.get({ accountId: $accountId }),
      );

      for (const user of roomUsers) {
        if (!user) continue;
        //ignore current user
        if (accountId && user?.getAccountId() === accountId) continue;

        const position = user.getPosition();
        //if spawn, ignore
        if (getPoint(position) === RoomPointEnum.SPAWN) continue;

        //if is occupied, set as empty
        roomLayout[position.z][position.x] = RoomPointEnum.EMPTY;
      }

      for (const furniture of getFurnitures()) {
        if (furniture.type === FurnitureType.FRAME) continue;
        const position = furniture.position;
        roomLayout[position.z][position.x] = RoomPointEnum.EMPTY;
      }

      const grid = getRoomGridLayout(roomLayout);

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

    const addFurniture = (furniture: RoomFurniture) => {
      furniture.position = {
        ...furniture.position,
        y: getYFromPoint(furniture.position),
      };
      $room.furniture.push(furniture);

      $save(room.id, { furniture: [furniture] });
    };
    const removeFurniture = (furniture: RoomFurniture) => {
      $room.furniture = $room.furniture.filter((f) => f.uid !== furniture.uid);

      $save(room.id, { furniture: $room.furniture }, false);
    };
    const getFurnitures = (): RoomFurniture[] => $room.furniture;

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

    return {
      getId,
      getTitle,
      getDescription,

      addUser,
      removeUser,
      getUsers,

      getPoint,
      isPointFree,
      findPath,

      addFurniture,
      removeFurniture,
      getFurnitures,

      getObject,

      emit,
    };
  };

  const create = (room: RawRoom) => {
    let layout: RoomPoint[][] = room.layout.map((line) =>
      line
        .split("")
        .map((value) =>
          parseInt(value) ? parseInt(value) : (value as RoomPointEnum),
        ),
    );

    roomMap[room.id] = $getRoom({
      ...room,
      layout,
      spawnPoint: getRoomSpawnPoint(layout),
      spawnDirection: getRoomSpawnDirection(layout),
    });
    roomUserMap[room.id] = [];
  };

  const get = (roomId: string): RoomMutable | null => roomMap[roomId];

  const getList = (): RoomMutable[] => Object.values(roomMap);

  const getRandom = (): RoomMutable => {
    const roomList = Object.values(roomMap);
    const roomIndex = getRandomNumber(0, roomList.length - 1);
    return roomList[roomIndex];
  };

  const generateDefaultRooms = async () => {
    for (const room of DEFAULT_ROOMS) {
      await System.db.set(["rooms", room.id], room);
    }
  };

  const $save = async (
    roomId: string,
    mutable: Partial<RawRoom>,
    merge = true,
  ) => {
    const roomResult = await System.db.get(["rooms", roomId]);
    if (!roomResult.value) {
      console.error(`Room with id ${roomId} not found.`);
      return;
    }

    const room = roomResult.value;
    for (const key in mutable) {
      if (merge && Array.isArray(room[key]) && Array.isArray(mutable[key])) {
        room[key] = [...room[key], ...mutable[key]];
      } else {
        room[key] = mutable[key];
      }
    }
    await System.db.set(["rooms", roomId], room);
  };

  const load = async () => {
    const rooms = await System.db.list({ prefix: ["rooms"] });
    if (!rooms) await generateDefaultRooms();

    for (const { value, key } of rooms) {
      create(value);
      log(`Loaded room ${key[1]}...`);
    }
  };

  return {
    load,

    create,
    get,
    getList,

    getRandom,
  };
};
