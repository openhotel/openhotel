import { Point, RawRoom, Room, RoomUser, User } from "shared/types/main.ts";
import { ProxyEvent, RoomPoint } from "shared/enums/main.ts";
import { Server } from "./main.ts";

export const rooms = () => {
  let roomMap: Record<string, Room> = {};
  let roomUserMap: Record<string, RoomUser[]> = {};
  let userRoomMap: Record<string, string> = {};

  const getRoomSpawnPoint = (layout: RoomPoint[][]): Point => {
    const roomSize = {
      width: layout.length,
      depth: Math.max(...layout.map((line) => line.length)),
    };

    for (let x = 0; x < roomSize.width; x++) {
      const roomLine = layout[x];
      for (let z = 0; z < roomSize.depth; z++) {
        if (roomLine[z] === RoomPoint.SPAWN) return { x, y: 0, z };
      }
    }
    return undefined;
  };

  const create = (room: RawRoom) => {
    const layout: RoomPoint[][] = room.layout.map((line) =>
      line.split("").map((value) => {
        switch (value) {
          case "█":
            return RoomPoint.TILE;
          case "s":
            return RoomPoint.SPAWN;
        }
        return RoomPoint.EMPTY;
      }),
    );
    roomMap[room.id] = {
      ...room,
      layout,
      spawnPoint: getRoomSpawnPoint(layout),
    };
    roomUserMap[room.id] = [];
  };

  const get = (roomId: string): Room => roomMap[roomId];

  const addUser = ($roomId: string, $user: User) => {
    const { spawnPoint } = roomMap[$roomId];
    if (!roomMap[$roomId]) return;

    userRoomMap[$user.id] = $roomId;

    Server.proxy.emitRoom({
      roomId: $roomId,
      event: ProxyEvent.ADD_HUMAN,
      data: {
        user: $user,
        position: spawnPoint,
      },
    });

    for (const { user, position } of roomUserMap[$roomId])
      Server.proxy.emit({
        users: [$user.id],
        event: ProxyEvent.ADD_HUMAN,
        data: {
          user,
          position,
          isOld: true,
        },
      });

    roomUserMap[$roomId].push({
      user: {
        id: $user.id,
        username: $user.username,
      },
      position: spawnPoint,
    });
  };

  const removeUser = (user: User) => {
    const roomId = userRoomMap[user.id];
    roomUserMap[roomId] = roomUserMap[roomId].filter(
      (roomUser) => user.id !== roomUser.user.id,
    );

    delete userRoomMap[user.id];

    Server.proxy.emit({
      users: roomUserMap[roomId].map(({ user }) => user.id),
      event: ProxyEvent.REMOVE_HUMAN,
      data: {
        user,
      },
    });
  };

  const getUsers = (roomId: string): RoomUser[] => roomUserMap[roomId];
  const getUserRoom = (user: User) => roomMap[userRoomMap[user.id]];

  const setUserPosition = (roomId: string, user: User, position: Point) => {
    roomUserMap[roomId].find(({ user: { id } }) => user.id === id).position =
      position;
  };

  create({
    id: "test_0",
    title: "Room 1",
    description: "This is a description",
    layout: [
      "   s   ",
      "██ ███",
      "██ ███",
      "██████",
      "█████████",
      "██████  █",
      "█████████",
      "     ████",
    ],
  });

  create({
    id: "test_1",
    title: "Room 2",
    description: "This is a description",
    layout: [" ██████", " ███████", "s███████", " ███████"],
  });

  create({
    id: "test_2",
    title: "Room 3",
    description: "This is a description",
    layout: [
      "    s    ",
      "█  ██████",
      "█  ██████",
      "█████████",
      "██████",
      "██████",
      "██████",
    ],
  });

  return {
    create,
    get,

    addUser,
    removeUser,
    getUsers,
    getUserRoom,

    setUserPosition,
  };
};
