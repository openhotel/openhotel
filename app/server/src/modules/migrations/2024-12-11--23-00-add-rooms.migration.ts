import { Migration, DbMutable, getRandomString } from "@oh/utils";
import {
  getRoomSpawnDirection,
  getRoomSpawnPoint,
} from "shared/utils/rooms.utils.ts";

export default {
  id: "2024-12-11--23-00-add-rooms",
  description: "Add initial rooms",
  up: async (db: DbMutable) => {
    const removeAllItems = async (id: string) => {
      const { items } = await db.list({ prefix: [id] });
      for (const { key } of items) await db.delete(key);
    };

    // Remove all previous rooms
    await removeAllItems("rooms");

    //Generate the new rooms
    for (const room of DEFAULT_ROOMS) {
      let layout = room.layout.map((line) =>
        line
          .split("")
          .map((value) => (parseInt(value) ? parseInt(value) : value)),
      );

      const roomData = {
        ...room,
        layout,
        spawnPoint: getRoomSpawnPoint(layout),
        spawnDirection: getRoomSpawnDirection(layout),
      };
      await db.set(["rooms", room.id], roomData);
    }
  },
  down: async (db: DbMutable) => {},
} as Migration;

const OWNER_ID = "01J2H3CDB0C14XBWZKH8Z1QYW3";
export const DEFAULT_ROOMS = [
  {
    version: 1,
    id: crypto.randomUUID(),
    title: "Room 1",
    ownerId: OWNER_ID,
    description: `This is a description 1 ${getRandomString(16)}`,
    furniture: [],
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
  },
  {
    version: 1,
    id: crypto.randomUUID(),
    title: "Room 2",
    ownerId: OWNER_ID,
    description: `This is a description 2 ${getRandomString(16)}`,
    furniture: [],
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
  },
  {
    version: 1,
    id: crypto.randomUUID(),
    title: "Room 3",
    ownerId: OWNER_ID,
    description: `This is a description 3 ${getRandomString(16)}`,
    furniture: [],
    layout: ["x111111", "x111111", "s111111", "x111111", "x111111", "x111111"],
  },
  {
    version: 1,
    id: crypto.randomUUID(),
    title: "Room 4",
    ownerId: OWNER_ID,
    description: `This is a description 4 ${getRandomString(16)}`,
    furniture: [],
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
  },
  {
    version: 1,
    id: crypto.randomUUID(),
    title: "Room 5",
    ownerId: OWNER_ID,
    description: `This is a description 5 ${getRandomString(16)}`,
    furniture: [],
    layout: [
      "xxxsxxx44",
      "xxx1xxx44",
      "xxx122344",
      "xxx2xxx44",
      "xx222xx44",
      "xx222xx44",
      "xx2x33344",
      "xx2333344",
      "xx2333344",
    ],
  },
  {
    version: 1,
    id: crypto.randomUUID(),
    title: "Room 6",
    ownerId: OWNER_ID,
    description: `This is a description 6 ${getRandomString(16)}`,
    furniture: [],
    layout: [
      "xxxxxxxx11",
      "xxxxxxxx11",
      "xxxxsxxx11",
      "x111111111",
      "x111111111",
      "x222222222",
      "x222222222",
      "x333333333",
      "x333333333",
      "x444444444",
      "x444444444",
      "x555555555",
      "x555555555",
      "x555555555",
    ],
  },
];
