import {
  Point3d,
  RawRoom,
  Room,
  RoomMutable,
  RoomPoint,
  User,
} from "shared/types/main.ts";
import { ProxyEvent, RoomPointEnum } from "shared/enums/main.ts";
import { Grid } from "@oh/pathfinding";
import { Server } from "modules/server/main.ts";
import { getInterpolatedPath } from "shared/utils/pathfinding.utils.ts";
import { getRandomNumber } from "shared/utils/random.utils.ts";

export const rooms = () => {
  let roomMap: Record<string, Room> = {};
  let roomUserMap: Record<string, string[]> = {};
  let roomUserLockedPointsMap: Record<string, Record<string, Point3d[]>> = {};

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
      roomUserLockedPointsMap[room.id][user.id] = [];
    };
    const removeUser = (user: User) => {
      const $user = Server.game.users.get({ id: user.id });
      if (!$user) return;

      const $userId = $user.getId();

      $user.removeRoom();

      roomUserMap[room.id] = roomUserMap[room.id].filter(
        (userId) => userId !== $userId,
      );
      delete roomUserLockedPointsMap[room.id][$userId];

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
    const setUserLockedPoints = (userId: string, points: Point3d[]) => {
      roomUserLockedPointsMap[room.id][userId] = points;
    };

    const getPoint = (position: Point3d) => room.layout[position.z][position.x];

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

        // set as empty the locked points too
        const userLockedPoints = roomUserLockedPointsMap[room.id][userId] || [];
        for (const lockedPoint of userLockedPoints)
          roomLayout[lockedPoint.z][lockedPoint.x] = RoomPointEnum.EMPTY;
        //if is occupied, set as empty
        roomLayout[position.z][position.x] = RoomPointEnum.EMPTY;
      }

      //TODO remove from the roomLayout the objects

      const grid = $getGridLayout(roomLayout);

      const path = grid
        .findPath(
          { x: start.x, y: start.z },
          { x: end.x, y: end.z },
          { maxJumpCost: 5 },
        )
        .map(({ x, y }) => ({ x, y: 0, z: y }));
      return getInterpolatedPath(path);
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
      setUserLockedPoints,

      getPoint,
      findPath,

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
        let point = layout[z][x];
        switch (point) {
          case RoomPointEnum.SPAWN:
            point = 4;
            break;
          case RoomPointEnum.EMPTY:
            point = 0;
            break;
          default:
            point *= 4;
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
      spawnPoint: $getRoomSpawnPoint(layout),
    };
    roomUserMap[room.id] = [];
    roomUserLockedPointsMap[room.id] = {};
  };

  const get = (roomId: string): RoomMutable | null => $getRoom(roomMap[roomId]);

  const getRandom = (): RoomMutable => {
    const roomList = Object.values(roomMap);
    const roomIndex = getRandomNumber(0, roomList.length - 1);
    return $getRoom(roomList[roomIndex]);
  };

  create({
    id: "test_1",
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
    id: "test_0",
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
