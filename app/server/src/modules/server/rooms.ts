import {
  Point,
  RawRoom,
  Room,
  RoomUser,
  User,
  RoomPoint,
} from "shared/types/main.ts";
import { ProxyEvent, RoomPointEnum } from "shared/enums/main.ts";
import { Server } from "./main.ts";
import { transpose, Grid } from "@oh/pathfinding";

export const rooms = () => {
  let roomMap: Record<string, Room> = {};
  let roomUserMap: Record<string, Record<string, RoomUser>> = {};
  let userRoomMap: Record<string, string> = {};

  const getRoomSpawnPoint = (layout: RoomPoint[][]): Point => {
    const roomSize = {
      width: layout.length,
      depth: Math.max(...layout.map((line) => line.length)),
    };

    for (let x = 0; x < roomSize.width; x++) {
      const roomLine = layout[x];
      for (let z = 0; z < roomSize.depth; z++) {
        if (roomLine[z] === RoomPointEnum.SPAWN) return { x, y: 0, z };
      }
    }
    return undefined;
  };

  const getGridLayout = (layout: RoomPoint[][]) => {
    let grid: number[][] = [];
    for (let x = 0; x < layout.length; x++) {
      grid[x] = [];
      for (let z = 0; z < layout[x].length; z++) {
        let point = layout[x][z];
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
        grid[x][z] = point;
      }
    }
    return Grid.from(transpose(grid));
  };

  const create = (room: RawRoom) => {
    const layout: RoomPoint[][] = room.layout.map((line) =>
      line
        .split("")
        .map((value) =>
          parseInt(value) ? parseInt(value) : (value as RoomPointEnum),
        ),
    );
    roomMap[room.id] = {
      ...room,
      layout,
      spawnPoint: getRoomSpawnPoint(layout),
    };
    roomUserMap[room.id] = {};
  };

  const get = (roomId: string): Room => roomMap[roomId];

  const addUser = ($roomId: string, $user: User) => {
    const { spawnPoint } = roomMap[$roomId];
    if (!roomMap[$roomId]) return;
    // If user is already on a room, leave
    // removeUser($user);
    //
    if (userRoomMap[$user.id]) {
      userRoomMap[$user.id];
    }

    userRoomMap[$user.id] = $roomId;

    //Add user to "room" internally
    Server.proxy.$emit(ProxyEvent.$ADD_ROOM, {
      userId: $user.id,
      roomId: $roomId,
    });

    //Load room to user
    Server.proxy.emit({
      event: ProxyEvent.LOAD_ROOM,
      users: $user.id,
      data: {
        room: roomMap[$roomId],
      },
    });

    //Add user to room
    Server.proxy.emitRoom({
      roomId: $roomId,
      event: ProxyEvent.ADD_HUMAN,
      data: {
        user: $user,
        position: spawnPoint,
      },
    });

    //Send every existing user inside room to the user
    for (const { user, position } of Object.values(roomUserMap[$roomId]))
      Server.proxy.emit({
        users: [$user.id],
        event: ProxyEvent.ADD_HUMAN,
        data: {
          user,
          position,
          isOld: true,
        },
      });

    roomUserMap[$roomId][$user.id] = {
      user: {
        id: $user.id,
        username: $user.username,
      },
      position: spawnPoint,
      joinedAt: performance.now(),
    };
  };

  const removeUser = (user: User) => {
    const roomId = userRoomMap[user.id];
    if (roomId) {
      delete roomUserMap[roomId][user.id];
      delete userRoomMap[user.id];

      //Remove user from internal "room"
      Server.proxy.$emit(ProxyEvent.$REMOVE_ROOM, {
        userId: user.id,
        roomId,
      });
      //Disconnect user from current room
      Server.proxy.emit({
        users: user.id,
        event: ProxyEvent.LEAVE_ROOM,
        data: {},
      });
      //Remove user human from the room to existing users
      Server.proxy.emit({
        users: Object.keys(roomUserMap[roomId]),
        event: ProxyEvent.REMOVE_HUMAN,
        data: {
          user,
        },
      });
    }
  };

  const getUsers = (roomId: string): RoomUser[] =>
    Object.values(roomUserMap[roomId]);

  const getUser = (roomId: string, userId: string): RoomUser =>
    roomUserMap[roomId][userId];

  const getUserRoom = (user: User): Room => roomMap[userRoomMap[user.id]];

  const setUserPosition = (roomId: string, user: User, position: Point) => {
    roomUserMap[roomId][user.id].position = position;
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
      "sx11112222",
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

    getGridLayout,

    addUser,
    removeUser,
    getUsers,
    getUser,
    getUserRoom,

    setUserPosition,
  };
};
