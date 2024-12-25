import { DbMutable } from "@oh/utils";

const MIGRATION_LIST = [
  await import("./2024-12-04--20-50-remove-me.migration.ts"),
  await import("./2024-12-11--23-00-add-rooms.migration.ts"),
  await import("./2024-12-16--01-03-remove-furniture-uid.migration.ts"),
  await import("./2024-12-26--00-10-remove-furniture.migration.ts"),
];

export const Migrations = (() => {
  const load = async (db: DbMutable) => {
    await db.migrations.load(MIGRATION_LIST.map((module) => module.default));
  };

  return {
    load,
  };
})();
