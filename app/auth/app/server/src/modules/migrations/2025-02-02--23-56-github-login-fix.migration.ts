import { Migration, DbMutable } from "@oh/utils";

export default {
  id: "2025-02-02--23-56-github-login-fix",
  description: `fix github login`,
  up: async (db: DbMutable) => {
    const { items: accounts } = await db.list({
      prefix: ["accounts"],
    });

    for await (const { key, value } of accounts) {
      if (!value.githubLogin) continue;

      await db.set(key, {
        ...value,
        githubLogin: value.githubLogin.login,
        updatedAt: Date.now(),
      });
    }
  },
  down: async (db: DbMutable) => {
    const { items: accounts } = await db.list({
      prefix: ["accounts"],
    });

    for await (const { key, value } of accounts) {
      if (!value.githubLogin) continue;

      await db.set(key, {
        ...value,
        githubLogin: { login: value.githubLogin.login },
        updatedAt: Date.now(),
      });
    }
  },
} as Migration;
