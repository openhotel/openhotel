import { Migration, DbMutable } from "@oh/utils";

export default {
  id: "2025-03-22--22-48-remove-invalid-email-users",
  description: `remove invalid email users`,
  up: async (db: DbMutable) => {
    const { items } = await db.list({
      prefix: ["accounts"],
    });

    for (const { key, value } of items) {
      const encryptedEmail = (await db.get([
        "emailsByHash",
        value.emailHash,
      ])) as string;

      if (!encryptedEmail) await db.delete(key);
    }
  },
  down: async (db: DbMutable) => {},
} as Migration;
