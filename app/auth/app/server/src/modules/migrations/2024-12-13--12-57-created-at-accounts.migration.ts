import { Migration, DbMutable } from "@oh/utils";

export default {
  id: "2024-12-13--12-57-created-at-accounts",
  description: `
  Add missing created at date on old accounts
  (2024-11-26 is the introduction of the createdAt)`,
  up: async (db: DbMutable) => {
    const accounts = await db.list({ prefix: ["accounts"] });
    for await (const account of accounts) {
      const accountKey = account.key;
      const accountValue = account.value;

      if (accountValue.createdAt) continue;

      await db.set(accountKey, {
        ...accountValue,
        createdAt: Date.parse("2024-11-26"),
      });
    }
  },
  down: async (db: DbMutable) => {},
} as Migration;
