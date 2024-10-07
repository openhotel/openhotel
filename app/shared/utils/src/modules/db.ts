import type {
  DbConsistency,
  DbKey,
  DbListOptions,
  DbListSelector,
  DbMutable,
  DbProps,
  ResultItem,
} from "../types/db.types.ts";

export const getDb = ({ pathname }: DbProps): DbMutable => {
  let db: Deno.Kv;

  const load = async () => {
    db = await Deno.openKv(pathname ?? "./database");
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

  return {
    get,
    set,
    list,
    getMany,
    delete: $delete,

    load,
    close,
  };
};
