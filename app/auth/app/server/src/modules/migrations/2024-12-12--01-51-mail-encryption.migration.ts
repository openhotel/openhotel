import { Migration, DbMutable, encrypt, decrypt } from "@oh/utils";

export default {
  id: "2024-12-12--01-51-mail-encryption",
  description: "Encrypt user email addresses stored in the database",
  up: async (db: DbMutable) => {
    const DB_SECRET_KEY = Deno.env.get("DB_SECRET_KEY") ?? "";

    const getEmailHash = async (text: string): Promise<string> => {
      const hashedEmail = await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(text),
      );
      return btoa(String.fromCharCode(...new Uint8Array(hashedEmail)));
    };

    // accounts
    const accounts = await db.list({ prefix: ["accounts"] });
    for await (const account of accounts) {
      const accountKey = account.key;
      const accountValue = account.value;

      const emailHash = await getEmailHash(accountValue.email);

      // create table emailsByHash
      const encryptedEmail = await encrypt(accountValue.email, DB_SECRET_KEY);

      delete accountValue.email;
      await db.set(accountKey, { ...accountValue, emailHash });
      await db.set(["emailsByHash", emailHash], encryptedEmail);
    }

    // accountsByEmail
    const accountsByEmail = await db.list({ prefix: ["accountsByEmail"] });
    for await (const account of accountsByEmail) {
      const oldKey = account.key;
      const email = oldKey[1];
      const accountValue = account.value;

      if (email) {
        const emailHash = await getEmailHash(email);

        await db.set(["accountsByEmail", emailHash], accountValue);
        await db.delete(oldKey);
      }
    }
  },
  down: async (db: DbMutable) => {
    const DB_SECRET_KEY = Deno.env.get("DB_SECRET_KEY") ?? "";

    // accounts
    const accounts = await db.list({ prefix: ["accounts"] });
    for await (const account of accounts) {
      const accountKey = account.key;
      const accountValue = account.value;

      const encryptedEmail = await db.get([
        "emailsByHash",
        accountValue.emailHash,
      ]);

      const email = await decrypt(encryptedEmail, DB_SECRET_KEY);

      delete accountValue.emailHash;
      await db.set(accountKey, { ...accountValue, email });
    }

    // accountsByEmail
    const accountsByEmail = await db.list({ prefix: ["accountsByEmail"] });
    for await (const account of accountsByEmail) {
      const oldKey = account.key;
      const email = oldKey[1];
      const accountValue = account.value;

      if (email) {
        const encryptedEmail = await db.get(["emailsByHash", email]);

        const decryptedEmail = await decrypt(encryptedEmail, DB_SECRET_KEY);

        await db.set(["accountsByEmail", decryptedEmail], accountValue);
        await db.delete(oldKey);
      }
    }

    // emailsByHash
    for (const { key } of await db.list({ prefix: ["emailsByHash"] })) {
      await db.delete(key);
    }
  },
} as Migration;
