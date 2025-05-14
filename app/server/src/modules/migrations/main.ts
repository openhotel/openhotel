import { DbMutable } from "@oh/utils";

const MIGRATION_LIST = [
  await import("./2024-12-04--20-50-remove-me.migration.ts"),
  await import("./2024-12-11--23-00-add-rooms.migration.ts"),
  await import("./2024-12-16--01-03-remove-furniture-uid.migration.ts"),
  await import("./2025-01-24--09-00-add-demo-room.migration.ts"),
  await import("./2025-02-14--00-20-change-demo-room-description.migration.ts"),
  await import("./2025-01-24--23-32-add-private-rooms.migration.ts"),
  await import("./2025-04-10--11-37-remove-furniture.migration.ts"),
  await import("./2025-03-18--21-40-add-economy.migration.ts"),
  await import("./2025-05-06--16-20-private-rooms-index-list.migration.ts"),
  await import("./2025-05-14--16-06-add-room-layout.migration.ts"),
];

export const Migrations = (() => {
  const load = async (db: DbMutable) => {
    await db.migrations.load(MIGRATION_LIST.map((module) => module.default));
  };

  return {
    load,
  };
})();
