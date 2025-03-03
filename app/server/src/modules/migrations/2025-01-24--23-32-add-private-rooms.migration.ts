import { Migration, DbMutable } from "@oh/utils";

export default {
  id: "2025-01-24--23-32-add-private-rooms",
  description: "Add private rooms to different table + max users",
  up: async (db: DbMutable) => {
    const { items } = await db.list({ prefix: ["rooms"] });
    for (const { key, value } of items) {
      await db.set(["rooms", "private", value.id], {
        ...value,
        maxUsers: 10,
      });
      await db.delete(key);
    }
  },
  down: async (db: DbMutable) => {
    const { items } = await db.list({
      prefix: ["rooms", "private"],
    });
    for (const { key, value } of items) {
      delete value.maxUsers;
      await db.set(["rooms", value.id], value);
      await db.delete(key);
    }
  },
} as Migration;
