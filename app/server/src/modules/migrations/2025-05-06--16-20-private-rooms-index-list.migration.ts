import { Migration, DbMutable } from "@oh/utils";
import { ulid } from "@std/ulid";
import {
  getParsedRoomLayout,
  getRoomSpawnDirection,
  getRoomSpawnPoint,
} from "shared/utils/rooms.utils.ts";

const ROOM_LAYOUTS = [
  {
    id: 0,
    //88
    layout: [
      "x1111111111",
      "x1111111111",
      "x1111111111",
      "x1111111111",
      "x1111111111",
      "s1111111111",
      "x1111111111",
      "x1111111111",
      "x1111111111",
      "x1111111111",
      "x1111111111",
    ],
  },
  {
    id: 2,
    //91
    layout: [
      "x1111111111111",
      "x1111111111111",
      "x1111111111111",
      "s1111111111111",
      "x1111111111111",
      "x1111111111111",
      "x1111111111111",
    ],
  },
  {
    id: 3,
    //74
    layout: [
      "xxxxx111111",
      "xxxxx111111",
      "xxxxx111111",
      "xxxxx111111",
      "x1111111111",
      "s1111111111",
      "x1111111111",
      "x1111111111",
      "x1111111111",
    ],
  },
  {
    id: 4,
    //36
    layout: ["x111111", "x111111", "s111111", "x111111", "x111111", "x111111"],
  },
  {
    id: 5,
    //56
    layout: [
      "xxxxx1111",
      "xxxxx1111",
      "xx1111111",
      "xs1111111",
      "xx1111111",
      "111111111",
      "111111111",
      "111111111",
    ],
  },
  {
    id: 6,
    //80
    layout: [
      "xxxxxxx22222",
      "xxxxxxx22222",
      "xxxxxxx22222",
      "x11111222222",
      "x11111222222",
      "s11111222222",
      "x11111222222",
      "x11111222222",
      "xxxxxxx22222",
      "xxxxxxx22222",
    ],
  },
  {
    id: 7,
    //62
    layout: [
      "xxx11111",
      "xxs11111",
      "xxx11111",
      "xxx11111",
      "xxx22222",
      "xxx22222",
      "22222222",
      "22222222",
      "22222222",
      "22222222",
    ],
  },
];

export default {
  id: "2025-05-06--16-20-private-rooms-index-list",
  description: "add private rooms index layout",
  up: async (db: DbMutable) => {
    for (const { id, layout } of ROOM_LAYOUTS) {
      const $layout = getParsedRoomLayout(layout);

      await db.set(["rooms", "layouts", id], {
        layout: $layout,
        //private type: 0
        type: 0,
        spawnPoint: getRoomSpawnPoint($layout),
        spawnDirection: getRoomSpawnDirection($layout),
      });
    }

    const { items } = await db.list({ prefix: ["rooms", "private"] });
    for (const { key } of items) await db.delete(key);

    const id = ulid();

    db.set(["rooms", "private", id], {
      version: 1,
      id,
      title: "pagoru's private room",
      ownerId: "01J2H3CDB0C14XBWZKH8Z1QYW3",
      description: `Welcome to my room!`,
      furniture: [],
      layoutIndex: 6,
      maxUsers: 10,
    });
  },
  down: async (db: DbMutable) => {},
} as Migration;
