import type { S3Props } from "./s3.types.ts";

export type DbProps = {
  pathname?: string;
  backups?: {
    pathname?: string;
    onMigration?: boolean;
    password?: string;
    max?: number;
    s3?: S3Props;
  };
};

export type Migration = {
  id: string;
  description?: string;
  up: (db: DbMutable) => Promise<void>;
  down: (db: DbMutable) => Promise<void>;
};

export type DbMigrationsMutable = {
  load: (migrations: Migration[]) => Promise<void>;
  // up: (count?: number) => Promise<void>;
  // down: (count?: number) => Promise<void>;
};

export type DbCryptoMutable = {
  load: () => Promise<void>;

  getSecretKey: () => Promise<string>;

  getPepper: () => Promise<string>;
  pepperPassword: (password: string) => Promise<string>;

  encryptSHA256: (text: string) => Promise<string>;
  decryptSHA256: (hash: string) => Promise<string>;

  encryptPassword: (password: string) => Promise<string>;
  comparePassword: (password: string, passwordHash: string) => Promise<boolean>;
};

export type DbMutable = {
  get: <Value extends unknown>(
    key: DbKey,
    consistency?: DbConsistency,
  ) => Promise<Value | undefined>;

  set: (
    key: DbKey,
    value: unknown,
    config?: { expireIn?: number },
  ) => Promise<unknown>;

  list: <Value>(
    selector: DbListSelector,
    options?: DbListOptions,
  ) => Promise<{ items: ResultItem<Value>[]; nextCursor?: string }>;

  getMany: <Value extends readonly unknown[]>(
    keys: readonly [...{ [K in keyof Value]: DbKey }],
    consistency?: DbConsistency,
  ) => Promise<{ [K in keyof Value]: Value[K] }>;

  delete: (key: DbKey) => Promise<void>;

  load: () => Promise<void>;
  close: () => void;

  backup: (backup?: string) => Promise<void>;
  getBackups: () => Promise<BackupFile[]>;
  getBackupFile: (name: string) => Promise<Uint8Array>;
  removeBackup: (backup: string) => Promise<void>;

  visualize: () => Promise<void>;

  migrations: DbMigrationsMutable;
  crypto: DbCryptoMutable;
};

export type DbKeyPart =
  | Uint8Array
  | string
  | number
  | bigint
  | boolean
  | symbol;

export type DbKey = readonly DbKeyPart[];

export type DbListSelector =
  | { prefix: DbKey }
  | { prefix: DbKey; start: DbKey }
  | { prefix: DbKey; end: DbKey }
  | { start: DbKey; end: DbKey };

export type DbListOptions = {
  limit?: number;
  cursor?: string;
  reverse?: boolean;
  consistency?: DbConsistency;
  batchSize?: number;
};

export type DbConsistency = "strong" | "eventual";

export type ResultItem<Value> = { value: Value; key: DbKey }[];

export type BackupFile = {
  name: string;
  size: number;
};
