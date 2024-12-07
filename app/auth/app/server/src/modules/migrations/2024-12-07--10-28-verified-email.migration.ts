import { Migration, DbMutable } from "@oh/utils";

export default {
  id: "2024-12-07--10-28-verified-email",
  description: `
    This migration sets the verified attribute to true for all user accounts that were already registered 
  `,
  up: async (db: DbMutable) => {
    const accounts = await db.list({ prefix: ["accounts"] });
    for await (const account of accounts) {
      const accountKey = account.key;
      const accountValue = account.value;

      await db.set(accountKey, {
        ...accountValue,
        verified: true,
      });
    }
  },
  down: async (db: DbMutable) => {
    const accounts = await db.list({ prefix: ["accounts"] });
    for await (const account of accounts) {
      const accountKey = account.key;
      const accountValue = account.value;

      delete accountValue.verified;
      await db.set(accountKey, accountValue);
    }
  },
} as Migration;
