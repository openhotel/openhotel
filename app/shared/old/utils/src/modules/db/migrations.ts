import type {
  DbMigrationsMutable,
  DbMutable,
  DbProps,
  Migration,
} from "../../types/db.types.ts";

export const migrations = (
  props: DbProps,
  dbMutable: DbMutable,
): DbMigrationsMutable => {
  let migrationList: Migration[] = [];

  const load = async (migrations: Migration[]) => {
    console.log("> Loading migrations...");

    const migrationsIdList = migrations.map(({ id }) => id);

    const currentList: string[] = [];
    const repeatedList: string[] = [];
    for (const migrationId of migrationsIdList)
      currentList.includes(migrationId)
        ? repeatedList.push(migrationId)
        : currentList.push(migrationId);

    if (repeatedList.length)
      throw `Migrations need to have unique ids || Repeated ids: ${repeatedList.join(",")}`;

    migrationList = migrations;

    let { list, index } = ((await dbMutable.get(["__migrations"])) ?? {
      list: [],
      index: -1,
    }) as { list: string[]; index: number };

    let migrationError;
    for (const migration of migrationList) {
      if (list.includes(migration.id)) {
        console.log(`- Migration ${migration.id} was already applied!`);
        continue;
      }
      if (props?.backups?.onMigration)
        await dbMutable.backup(`_migration_${migration.id}`);

      try {
        await migration.up(dbMutable);
        list.push(migration.id);
        index++;
        console.log(`> Migration ${migration.id} applied (${index})!`);
      } catch (e) {
        migrationError = [`> Migration ${migration.id} failed!`, e];
        break;
      }
    }

    await dbMutable.set(["__migrations"], { list, index });

    if (migrationError) throw `${migrationError[0]} | ${migrationError[1]}`;

    console.log("> Migrations done!");
  };

  // const up = async (count = 1) => {
  //   //TODO
  // };
  //
  // const down = async (count = 1) => {
  //   //TODO
  // };

  return {
    load,
    // up,
    // down,
  };
};
