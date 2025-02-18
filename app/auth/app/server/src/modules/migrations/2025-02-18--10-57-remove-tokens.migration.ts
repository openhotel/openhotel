import { Migration, DbMutable } from "@oh/utils";

export default {
  id: "2025-02-18--10-57-remove-tokens",
  description: `remove old tokens system`,
  up: async (db: DbMutable) => {
    for (const { key } of await db.list({
      prefix: ["accountsByToken"],
    }))
      await db.delete(key);

    for (const { key } of await db.list({
      prefix: ["accountsByRefreshToken"],
    }))
      await db.delete(key);
  },
  down: async (db: DbMutable) => {},
} as Migration;
