import type {
  DbConsistency,
  DbKey,
  DbListOptions,
  DbListSelector,
  DbMigrationsMutable,
  DbMutable,
  DbProps,
  Migration,
  ResultItem,
} from "../types/db.types.ts";

export const getDb = (
  { pathname }: DbProps = { pathname: "./database" },
): DbMutable => {
  let db: Deno.Kv;

  const $migrations: DbMigrationsMutable = ((): DbMigrationsMutable => {
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

      let { list, index } = ((await get(["__migrations"])) ?? {
        list: [],
        index: -1,
      }) as { list: string[]; index: number };

      let migrationError;
      for (const migration of migrationList) {
        if (list.includes(migration.id)) {
          console.log(`- Migration ${migration.id} was already applied!`);
          continue;
        }
        try {
          await migration.up(dbMutables);
          list.push(migration.id);
          index++;
          console.log(`> Migration ${migration.id} applied (${index})!`);
        } catch (e) {
          migrationError = [`> Migration ${migration.id} failed!`, e];
          break;
        }
      }

      await set(["__migrations"], { list, index });

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
  })();

  const load = async () => {
    db = await Deno.openKv(pathname);
  };

  const $checkDbNull = () => {
    if (!db) console.error(`Db '${pathname}' is closed!`);

    return Boolean(db);
  };

  const get = async <Value extends unknown>(
    key: DbKey,
    consistency?: DbConsistency,
  ): Promise<Value | undefined> => {
    if (!$checkDbNull()) return;

    const { value } = await db.get(key, { consistency });
    return value as Value | undefined;
  };

  const set = async (
    key: DbKey,
    value: unknown,
    { expireIn }: { expireIn?: number } = {},
  ): Promise<unknown> => {
    if (!$checkDbNull()) return;

    return db.set(key, value, { expireIn });
  };

  const list = async <Value>(
    selector: DbListSelector,
    options?: DbListOptions,
  ): Promise<ResultItem<Value>[]> => {
    //@ts-ignore
    if (!$checkDbNull()) return;

    const items = [];
    for await (const entry of db.list(selector, options))
      items.push(entry as unknown as ResultItem<Value>);
    return items;
  };

  const getMany = async <Value extends readonly unknown[]>(
    keys: readonly [...{ [K in keyof Value]: DbKey }],
    consistency?: DbConsistency,
  ): Promise<{ [K in keyof Value]: Value[K] }> => {
    //@ts-ignore
    if (!$checkDbNull()) return;

    return db.getMany(keys, { consistency });
  };

  const $delete = (key: DbKey): Promise<void> => {
    //@ts-ignore
    if (!$checkDbNull()) return;
    return db.delete(key);
  };

  const close = () => {
    db?.close();
    //@ts-ignore
    db = null;
  };

  const dbMutables = {
    get,
    set,
    list,
    getMany,
    delete: $delete,

    load,
    close,

    migrations: $migrations,
  };
  return dbMutables;
};
