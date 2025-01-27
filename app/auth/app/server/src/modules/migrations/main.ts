import { DbMutable } from "@oh/utils";

const MIGRATION_LIST = [
  await import("./2024-12-04--15-10-test.migration.ts"),
  await import("./2024-12-04--15-14-test.migration.ts"),
  await import("./2024-12-05--14-34-licenses.migration.ts"),
  await import("./2024-12-07--10-28-verified-email.migration.ts"),
  await import("./2024-12-11--19-07-bye-passwords.migration.ts"),
  await import("./2024-12-12--01-51-mail-encryption.migration.ts"),
  await import("./2024-12-13--12-57-created-at-accounts.migration.ts"),
  await import("./2025-01-12--21-05-private-hotels.migration.ts"),
  await import(
    "./2025-01-23--15-15-remove-integrations-by-hotels-by-account-id.migration.ts"
  ),
  await import("./2025-01-23--22-00-remove-invalid-connections.migration.ts"),
  await import("./2025-01-27--09-48-add-language-to-accounts.migration.ts"),
];

export const Migrations = (() => {
  const load = async (db: DbMutable) => {
    await db.migrations.load(MIGRATION_LIST.map((module) => module.default));
  };

  return {
    load,
  };
})();
