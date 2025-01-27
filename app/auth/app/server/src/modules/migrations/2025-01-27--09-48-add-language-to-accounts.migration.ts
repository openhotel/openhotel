import { Migration, DbMutable } from "@oh/utils";

export default {
  id: "2025-01-27--09-48-add-language-to-accounts",
  description: `add spanish language to all previous accounts`,
  up: async (db: DbMutable) => {
    const accounts = await db.list({
      prefix: ["accounts"],
    });

    for await (const { key, value } of accounts) {
      await db.set(key, {
        ...value,
        languages: ["spanish"],
        updatedAt: Date.now(),
      });
    }
  },
  down: async (db: DbMutable) => {
    const accounts = await db.list({
      prefix: ["accounts"],
    });

    for await (const { key, value } of accounts) {
      delete value.languages;
      await db.set(key, {
        ...value,
        updatedAt: Date.now(),
      });
    }
  },
} as Migration;
