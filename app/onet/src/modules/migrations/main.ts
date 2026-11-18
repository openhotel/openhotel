import { DbMutable } from "@shared/types/db.types.ts";

const MIGRATION_LIST = [
  await import("./2024-12-12--15-17-remove-me.migration.ts"),
];

export const Migrations = (() => {
  const load = async (db: DbMutable) => {
    await db.migrations.load(MIGRATION_LIST.map((module) => module.default));
  };

  return {
    load,
  };
})();
