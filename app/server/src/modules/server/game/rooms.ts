import {
  Point3d,
  RawRoom,
  Room,
  RoomFurniture,
  RoomMutable,
  RoomPoint,
  User,
} from "shared/types/main.ts";
import { FurnitureType, ProxyEvent, RoomPointEnum } from "shared/enums/main.ts";
import { Grid } from "@oh/pathfinding";
import { Server } from "modules/server/main.ts";
import { getInterpolatedPath } from "shared/utils/pathfinding.utils.ts";
import { getRandomNumber } from "shared/utils/random.utils.ts";
import { isPoint3dEqual } from "shared/utils/point.utils.ts";

export const rooms = () => {
  let roomMap: Record<string, Room> = {};
  let roomUserMap: Record<string, string[]> = {};

  const $getRoom = (room: Room): RoomMutable => {
    const getId = () => room.id;
    const getTitle = () => room.title;
    const getDescription = () => room.description;

    const getSpawnPoint = (): Point3d => room.spawnPoint;

    const addUser = (user: User) => {
      const $user = Server.game.users.get({ id: user.id });
      if (!$user) return;

      $user.setRoom(room.id);
      $user.setPosition(getSpawnPoint());

      //Add user to "room" internally
      Server.proxy.$emit(ProxyEvent.$ADD_ROOM, {
        userId: $user.getId(),
        roomId: getId(),
      });

      //Load room to user
      $user.emit(ProxyEvent.LOAD_ROOM, { room: getObject() });

      //Add user to room
      emit(ProxyEvent.ADD_HUMAN, { user: $user.getObject() });

      //Send every existing user inside room to the user
      for (const userId of getUsers()) {
        const user = Server.game.users.get({ id: userId });
        $user.emit(ProxyEvent.ADD_HUMAN, {
          user: user.getObject(),
          isOld: true,
        });
      }

      roomUserMap[room.id].push($user.getId());
    };
    const removeUser = (user: User) => {
      const $user = Server.game.users.get({ id: user.id });
      if (!$user) return;

      const $userId = $user.getId();

      $user.removeRoom();

      roomUserMap[room.id] = roomUserMap[room.id].filter(
        (userId) => userId !== $userId,
      );

      //Remove user from internal "room"
      Server.proxy.$emit(ProxyEvent.$REMOVE_ROOM, {
        userId: $userId,
        roomId: room.id,
      });
      //Disconnect user from current room
      $user.emit(ProxyEvent.LEAVE_ROOM);
      //Remove user human from the room to existing users
      emit(ProxyEvent.REMOVE_HUMAN, { userId: $user.getId() });
    };
    const getUsers = () => roomUserMap[room.id];

    const getPoint = (position: Point3d) =>
      room.layout?.[position.z]?.[position.x];

    const isPointFree = (position: Point3d, userId?: string) => {
      if (getPoint(position) === RoomPointEnum.EMPTY) return false;
      if (getPoint(position) === RoomPointEnum.SPAWN) return true;

      return Boolean(
        !getUsers()
          .filter(($userId) => !userId || $userId !== userId)
          .find(($userId) => {
            const user = Server.game.users.get({ id: $userId });
            isPoint3dEqual(user.getPosition(), position);
          }) &&
          Boolean(
            !getFurniture()
              .filter((furniture) => furniture.type !== FurnitureType.FRAME)
              .find((furniture) =>
                isPoint3dEqual(furniture.position, position),
              ),
          ),
      );
    };

    const findPath = (start: Point3d, end: Point3d, userId?: string) => {
      const roomLayout = structuredClone(room.layout);
      const roomUsers = getUsers().map((userId) =>
        Server.game.users.get({ id: userId }),
      );

      for (const user of roomUsers) {
        //ignore current user
        if (userId && user.getId() === userId) continue;

        const position = user.getPosition();
        //if spawn, ignore
        if (getPoint(position) === RoomPointEnum.SPAWN) continue;

        //if is occupied, set as empty
        roomLayout[position.z][position.x] = RoomPointEnum.EMPTY;
      }

      for (const furniture of getFurniture()) {
        if (furniture.type === FurnitureType.FRAME) continue;
        const position = furniture.position;
        roomLayout[position.z][position.x] = RoomPointEnum.EMPTY;
      }

      const grid = $getGridLayout(roomLayout);

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
      roomMap[room.id].furniture.push(furniture);
    };
    const getFurniture = (): RoomFurniture[] => roomMap[room.id].furniture;

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

    const getObject = () => roomMap[room.id];

    const emit = <Data extends any>(
      event: ProxyEvent,
      data: Data = {} as Data,
    ) =>
      Server.proxy.emitRoom({
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

      getObject,

      emit,
    };
  };

  const $getRoomSpawnPoint = (layout: RoomPoint[][]): Point3d => {
    const roomSize = {
      width: layout.length,
      depth: Math.max(...layout.map((line) => line.length)),
    };

    for (let z = 0; z < roomSize.depth; z++) {
      const roomLine = layout[z];
      for (let x = 0; x < roomSize.width; x++) {
        if (roomLine[x] === RoomPointEnum.SPAWN) return { x, y: 0, z };
      }
    }
    return undefined;
  };

  const $getGridLayout = (layout: RoomPoint[][]) => {
    let grid: number[][] = [];
    for (let z = 0; z < layout.length; z++) {
      grid[z] = [];
      for (let x = 0; x < layout[z].length; x++) {
        let point = 0;
        switch (layout[z][x]) {
          case RoomPointEnum.SPAWN:
            point = 4;
            break;
          case RoomPointEnum.EMPTY:
            point = 0;
            break;
          default:
            point = parseInt(layout[z][x] + "") * 4;
            break;
        }
        grid[z][x] = point;
      }
    }
    return Grid.from(grid);
  };

  const create = (room: RawRoom) => {
    let layout: RoomPoint[][] = room.layout.map((line) =>
      line
        .split("")
        .map((value) =>
          parseInt(value) ? parseInt(value) : (value as RoomPointEnum),
        ),
    );

    roomMap[room.id] = {
      ...room,
      layout,
      furniture: [],
      spawnPoint: $getRoomSpawnPoint(layout),
    };
    roomUserMap[room.id] = [];
  };

  const get = (roomId: string): RoomMutable | null =>
    roomMap[roomId] ? $getRoom(roomMap[roomId]) : null;

  const getRandom = (): RoomMutable => {
    const roomList = Object.values(roomMap);
    const roomIndex = getRandomNumber(0, roomList.length - 1);
    return $getRoom(roomList[roomIndex]);
  };

  create({
    id: "test_0",
    title: "Room 1",
    description: "This is a description",
    layout: [
      "xxxxxx2222",
      "xxxxxx2222",
      "xxxxxx2222",
      "x111122222",
      "x111122222",
      "s111122222",
      "x111122222",
      "x111122222",
      "xxxxxx2222",
      "xxxxxx2222",
    ],
  });

  create({
    id: "test_1",
    title: "Room 2",
    description: "This is a description",
    layout: [
      "xxxxsxxxxx",
      "xxx111x222",
      "xx11112222",
      "x11111x222",
      "x11111x222",
      "x22222x333",
      "x33333x333",
      "x333333333",
      "x333333333",
      "x333333333",
      "x333333333",
      "x333333333",
    ],
  });

  create({
    id: "test_2",
    title: "Room 3",
    description: "This is a description",
    layout: ["x111111", "x111111", "s111111", "x111111", "x111111", "x111111"],
  });

  create({
    id: "test_3",
    title: "Room 4",
    description: "This is a description",
    layout: [
      "x111111",
      "x111111",
      "x111111",
      "x111111",
      "x111111",
      "x111111",
      "s111111",
      "x111111",
      "x111111",
      "x111111",
      "x111111",
      "x111111",
    ],
  });

  return {
    create,
    get,

    getRandom,
  };
};
