import {
  BackupFile,
  DbConsistency,
  DbKey,
  DbListOptions,
  DbListSelector,
  DbMutable,
  DbProps,
  ResultItem,
} from "../../types/db.types.ts";
import { join } from "@std/path";
import { migrations } from "./migrations.ts";
import { crypto } from "./crypto.ts";
import {
  DATABASE_KEY_FILE,
  DATABASE_PEPPER_FILE,
} from "../../consts/db.consts.ts";
import { getSSSPasswordV2 } from "../../utils/sss.utils.ts";
import { compressFiles } from "../../utils/zip.utils.ts";
import { getS3 } from "../s3.ts";
import { walk } from "@std/fs";
import { ulid } from "jsr:@std/ulid@1";

export const getDb = (props: DbProps = {}): DbMutable => {
  const {
    pathname = "./database",
    backups: {
      pathname: backupsPathname = "./database-backups",
      onMigration = true,
      max: maxBackups = 10,
      password,
      s3,
    } = {
      pathname: "./database-backups",
      onMigration: true,
    },
  } = props;
  const parsedProps = {
    pathname,
    backups: {
      onMigration,
      pathname: backupsPathname,
    },
  };
  let db: Deno.Kv;

  const load = async () => {
    try {
      await Deno.stat(backupsPathname!);
    } catch (e) {
      await Deno.mkdir(backupsPathname!);
    }

    await $crypto.load();
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
    //@ts-ignore
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
    // deno-lint-ignore ban-ts-comment
    //@ts-ignore
    db = null;
  };

  const backup = async (name?: string) => {
    const backupPathname = join(backupsPathname!, pathname);

    const files = ["", "-shm", "-wal", DATABASE_PEPPER_FILE, DATABASE_KEY_FILE];

    for (const file of files)
      try {
        await Deno.copyFile(pathname + file, backupPathname + file);
        // deno-lint-ignore no-empty
      } catch (_) {}

    const backupDb = await Deno.openKv(backupPathname);
    //this removes 'shm' and 'wal' files and closes correctly the db
    backupDb.close();

    const backupFilename = `${ulid()}${name ?? ""}`;
    const filePassword = password
      ? await getSSSPasswordV2(password, backupFilename)
      : null;

    await compressFiles(
      files.map((file) => backupPathname + file),
      join(backupsPathname!, backupFilename + ".zip"),
      filePassword,
    );

    for (const file of files)
      try {
        await Deno.remove(backupPathname + file);
        // deno-lint-ignore no-empty
      } catch (_) {}

    if (!s3) {
      if (!maxBackups) return;

      const files = [];

      for await (const entry of walk(backupsPathname!, {
        includeDirs: false,
      }))
        files.push(entry);

      files.sort((fileA, fileB) => (fileA.name > fileB.name ? -1 : 1));

      for (const toDeleteFile of files.slice(maxBackups))
        await Deno.remove(toDeleteFile.path);

      return;
    }

    const s3Client = getS3(s3);
    await s3Client.syncPath(backupsPathname, true);

    const s3Files = await s3Client.getFiles();
    s3Files.sort((fileA, fileB) => (fileA.name > fileB.name ? -1 : 1));

    await s3Client.removeObjects(s3Files.slice(maxBackups));
  };

  const getBackups = async (): Promise<BackupFile[]> => {
    if (s3) {
      const s3Client = getS3(s3);

      const s3Files = await s3Client.getFiles();

      return s3Files.map((file) => ({ name: file.name, size: file.size }));
    }

    const files: BackupFile[] = [];

    for await (const { name, path } of walk(backupsPathname!, {
      includeDirs: false,
    })) {
      const { size } = await Deno.stat(path);
      files.push({
        name,
        size,
      });
    }

    return files;
  };

  const getBackupFile = async (name: string): Promise<Uint8Array> => {
    if (s3) {
      const s3Client = getS3(s3);
      return await s3Client.getObject(name);
    }
    return await Deno.readFile(join(backupsPathname!, name));
  };

  const removeBackup = async (name: string): Promise<void> => {
    if (s3) {
      const s3Client = getS3(s3);
      return await s3Client.removeFiles(name);
    }
    return await Deno.remove(join(backupsPathname!, name));
  };

  const visualize = async () => {
    try {
      const entries = [];
      for (const entry of await list<unknown>({ prefix: [] })) {
        entries.push({
          //@ts-ignore
          key: JSON.stringify(entry.key),
          //@ts-ignore
          value: JSON.stringify(entry.value)?.substring(0, 16),
        });
      }

      console.table(entries);
      console.log(`Total entries: ${entries.length}`);
    } finally {
    }
  };

  const dbMutable: DbMutable = {
    get,
    set,
    list,
    getMany,
    delete: $delete,

    load,
    close,

    backup,
    getBackups,
    getBackupFile,
    removeBackup,

    visualize,

    get migrations() {
      return $migrations;
    },

    get crypto() {
      return $crypto;
    },
  };

  const $migrations = migrations(parsedProps, dbMutable);
  const $crypto = crypto(parsedProps);

  return dbMutable;
};
