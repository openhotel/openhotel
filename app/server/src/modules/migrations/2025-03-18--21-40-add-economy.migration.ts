import { Migration, DbMutable } from "@oh/utils";

export default {
  id: "2025-03-18--21-40-add-economy",
  description: "Add economy",
  up: async (db: DbMutable) => {
    const { items: users } = await db.list({ prefix: ["users"] });
    for (const { value } of users) {
      await db.set(["users", value.accountId, "balance"], 100);
    }

    await db.set(["hotel", "balance"], 1000);
  },
  down: async (db: DbMutable) => {
    const { items: users } = await db.list({ prefix: ["users"] });
    for (const { value } of users) {
      await db.delete(["users", value.accountId, "balance"]);
    }
    await db.delete(["hotel", "balance"]);
  },
} as Migration;
