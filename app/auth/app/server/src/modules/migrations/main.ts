import { DbMutable } from "@oh/utils";

const MIGRATION_LIST = [
  await import("./2024-12-04--15-10-test.migration.ts"),
  await import("./2024-12-04--15-14-test.migration.ts"),
  await import("./2024-12-05--14-34-licenses.migration.ts"),
  await import("./2024-12-07--10-28-verified-email.migration.ts"),
  await import("./2024-12-11--19-07-bye-passwords.migration.ts"),
];

export const Migrations = (() => {
  const load = async (db: DbMutable) => {
    await db.migrations.load(MIGRATION_LIST.map((module) => module.default));
  };

  return {
    load,
  };
})();
