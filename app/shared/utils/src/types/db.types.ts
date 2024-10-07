export type DbProps = {
  pathname?: string;
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
  ) => Promise<ResultItem<Value>[]>;

  getMany: <Value extends readonly unknown[]>(
    keys: readonly [...{ [K in keyof Value]: DbKey }],
    consistency?: DbConsistency,
  ) => Promise<{ [K in keyof Value]: Value[K] }>;

  delete: (key: DbKey) => Promise<void>;

  load: () => Promise<void>;
  close: () => void;
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
