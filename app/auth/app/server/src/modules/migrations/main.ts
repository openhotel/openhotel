import { DbMutable } from "@oh/utils";

const MIGRATION_LIST = [
  await import("./2025-02-02--23-56-github-login-fix.migration.ts"),
  await import("./2025-02-17--18-33-migrate-to-ulid.migration.ts"),
  await import("./2025-02-18--10-57-remove-tokens.migration.ts"),

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // await import("./9999-test.migration.ts"),
];

export const Migrations = (() => {
  const load = async (db: DbMutable) => {
    await db.migrations.load(MIGRATION_LIST.map((module) => module.default));
  };

  return {
    load,
  };
})();
