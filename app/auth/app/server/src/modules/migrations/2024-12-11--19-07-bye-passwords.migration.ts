import { Migration, DbMutable } from "@oh/utils";

export default {
  id: "2024-12-11--19-07-bye-passwords",
  description: `
    This migration removes all the passwords of accounts to allow the peppered ones.
    All users need to recover the password after this.
  `,
  up: async (db: DbMutable) => {
    const accounts = await db.list({ prefix: ["accounts"] });
    for await (const account of accounts) {
      const accountKey = account.key;
      const accountValue = account.value;

      await db.set(accountKey, {
        ...accountValue,
        passwordHash: null,
        verified: true,
      });
    }
  },
  down: async (db: DbMutable) => {
    //Not possible
  },
} as Migration;
