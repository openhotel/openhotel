import { Migration, DbMutable } from "@oh/utils";
import { ulid } from "@std/ulid";
import {
  getParsedRoomLayout,
  getRoomSpawnDirection,
  getRoomSpawnPoint,
} from "shared/utils/rooms.utils.ts";

const ROOM_LAYOUTS = [
  {
    id: 1,
    //88
    layout: [
      "xxxxsxxxxx",
      "1111111111",
      "1111111111",
      "1111111111",
      "1111111111",
      "1111111111",
      "1111111111",
      "1111111111",
      "1111111111",
      "1111111111",
      "1111111111",
      "1111111111",
    ],
  },
];

export default {
  id: "2025-05-14--16-06-add-room-layout",
  description: "add room layout",
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

    const id = ulid();

    db.set(["rooms", "private", id], {
      version: 1,
      id,
      title: "alqubo's roooooom!!!",
      ownerId: "01J5DRNAN0PQF218376XVQPYRR",
      description: `This is my room!`,
      furniture: [],
      layoutIndex: 1,
      maxUsers: 15,
    });
  },
  down: async (db: DbMutable) => {},
} as Migration;
