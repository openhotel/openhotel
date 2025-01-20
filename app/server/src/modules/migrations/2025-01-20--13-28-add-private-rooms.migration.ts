import { Migration, DbMutable, getRandomString } from "@oh/utils";
import { PrivateRawRoom } from "shared/types/main.ts";

export default {
  id: "2024-01-20--13-28-private-rooms",
  description: "Add private rooms to different table + max users",
  up: async (db: DbMutable) => {
    for (const { key, value } of await db.list({ prefix: ["rooms"] })) {
      await db.set(["rooms", "private", value.id], {
        ...value,
        maxUsers: 10,
      });
      await db.delete(key);
    }
  },
  down: async (db: DbMutable) => {
    for (const { key, value } of await db.list({
      prefix: ["rooms", "private"],
    })) {
      delete value.maxUsers;
      await db.set(["rooms", value.id], value);
      await db.delete(key);
    }
  },
} as Migration;

const OWNER_ID = "edd8081d-d160-4bf4-b89b-133d046c87ff";
export const DEFAULT_ROOMS: PrivateRawRoom[] = [
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
