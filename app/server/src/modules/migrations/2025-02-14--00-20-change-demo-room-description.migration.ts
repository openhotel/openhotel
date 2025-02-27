import { Migration, DbMutable } from "@oh/utils";

export default {
  id: "2025-02-14--00-20-change-demo-room-description",
  description: "Change demo room description",
  up: async (db: DbMutable) => {
    const { items: rooms } = await db.list({ prefix: ["rooms"] });
    for (const { key, value } of rooms) {
      if (value.description === "This is a room for show all furnitures") {
        await db.set(key, {
          ...value,
          description: "This is a room to show all furnitures",
        });
        return;
      }
    }
  },
  down: async (db: DbMutable) => {
    const { items: rooms } = await db.list({ prefix: ["rooms"] });
    for (const { key, value } of rooms) {
      if (value.description === "This is a room to show all furnitures") {
        await db.set(key, {
          ...value,
          description: "This is a room for show all furnitures",
        });
        return;
      }
    }
  },
} as Migration;
