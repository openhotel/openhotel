import { Migration, DbMutable } from "@oh/utils";
import {
  getRoomSpawnDirection,
  getRoomSpawnPoint,
} from "shared/utils/rooms.utils.ts";

export default {
  id: "2025-01-24--09-00-add-demo-room",
  description: "Add demo room",
  up: async (db: DbMutable) => {
    const room = {
      version: 1,
      id: crypto.randomUUID(),
      title: "Demo Furnitures",
      ownerId: OWNER_ID,
      description: `This is a room for show all furnitures`,
      furniture: [],
      layout: [
        "x1111111111111",
        "x1111111111111",
        "x1111111111111",
        "x1111111111111",
        "x1111111111111",
        "x1111111111111",
        "x1111111111111",
        "x1111111111111",
        "x1111111111111",
        "x1111111111111",
        "s1111111111111",
      ],
    };

    const layout = room.layout.map((line) =>
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
  },
  down: async (db: DbMutable) => {},
} as Migration;

const OWNER_ID = "01J5DRNAN0PQF218376XVQPYRR";
