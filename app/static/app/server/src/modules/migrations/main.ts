import { DbMutable } from "@oh/utils";

const MIGRATION_LIST = [
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
