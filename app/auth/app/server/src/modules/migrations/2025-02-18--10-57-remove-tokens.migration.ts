import { Migration, DbMutable } from "@oh/utils";

export default {
  id: "2025-02-18--10-57-remove-tokens",
  description: `remove old tokens system`,
  up: async (db: DbMutable) => {
    const { items: accountsByToken } = await db.list({
      prefix: ["accountsByToken"],
    });
    for (const { key } of accountsByToken) await db.delete(key);

    const { items: accountsByRefreshToken } = await db.list({
      prefix: ["accountsByRefreshToken"],
    });
    for (const { key } of accountsByRefreshToken) await db.delete(key);
  },
  down: async (db: DbMutable) => {},
} as Migration;
