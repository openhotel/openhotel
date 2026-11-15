import { parse as parseEnv } from "@std/dotenv";
import { parse as parseYaml, stringify as stringifyYaml } from "@std/yaml";
import { exists } from "@std/fs";
import { join, resolve } from "@std/path";

export const ROOT = import.meta.dirname!;

export type Service = {
  name: string;
  repo: string;
  config: string;
  data: string[];
};

export const SERVICES: Service[] = [
  {
    name: "client",
    repo: "openhotel",
    config: "app/server/config.yml",
    data: ["app/server/server-database*", "app/server/database-backups"],
  },
  {
    name: "auth",
    repo: "auth",
    config: "app/server/config.yml",
    data: [
      "app/server/database*",
      "app/server/deleteme-database*",
      "app/server/backups",
    ],
  },
  {
    name: "onet",
    repo: "onet",
    config: "config.yml",
    data: ["database*", "collections-key"],
  },
  {
    name: "web",
    repo: "web",
    config: "app/server/config.yml",
    data: ["app/server/database*", "app/server/backups"],
  },
  {
    name: "asset-editor",
    repo: "asset-editor",
    config: "app/server/config.yml",
    data: [],
  },
  {
    name: "static",
    repo: "static",
    config: "app/server/config.yml",
    data: ["app/server/database*", "app/server/files"],
  },
];

export const ok = (message: string) =>
  console.log(`%c✔ ${message}`, "color: green");
export const warn = (message: string) =>
  console.log(`%c⚠ ${message}`, "color: yellow");
export const fail = (message: string): never => {
  console.log(`%c✘ ${message}`, "color: red");
  Deno.exit(1);
};

export const loadEnv = async (): Promise<Record<string, string>> => {
  const envPath = join(ROOT, ".env");

  if (!(await exists(envPath))) {
    await Deno.copyFile(join(ROOT, ".env.example"), envPath);
    ok(".env created from .env.example");
  }

  return parseEnv(await Deno.readTextFile(envPath));
};

export const getReposDir = (env: Record<string, string>) =>
  resolve(ROOT, env.REPOS_DIR ?? "../../app");

export const readYaml = async <Data = Record<string, unknown>>(
  path: string,
): Promise<Data> => (parseYaml(await Deno.readTextFile(path)) ?? {}) as Data;

export const writeYaml = (path: string, data: unknown) =>
  Deno.writeTextFile(path, stringifyYaml(data, { lineWidth: -1 }));
