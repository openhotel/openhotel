import { exists } from "@std/fs";
import { dirname, join } from "@std/path";
import {
  getReposDir,
  loadEnv,
  ok,
  readYaml,
  ROOT,
  type Service,
  SERVICES,
  warn,
} from "./utils.ts";

const run = async (cmd: string, ...args: string[]): Promise<boolean> => {
  try {
    const { success } = await new Deno.Command(cmd, {
      args,
      stdout: "null",
      stderr: "inherit",
    }).output();

    return success;
  } catch {
    return false;
  }
};

const checkRequirements = async () => {
  if (!(await run("docker", "compose", "version"))) {
    warn("docker compose not found, you will need it to run the stack");
  }
};

const flatten = (
  object: Record<string, unknown>,
  prefix = "",
): Record<string, unknown> =>
  Object.entries(object).reduce((flat, [key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;

    return typeof value === "object" && value !== null && !Array.isArray(value)
      ? { ...flat, ...flatten(value as Record<string, unknown>, path) }
      : { ...flat, [path]: value };
  }, {});

const checkConfig = async (
  service: Service,
  configPath: string,
  templatePath: string,
) => {
  let config: Record<string, unknown>;
  try {
    config = flatten(await readYaml(configPath));
  } catch {
    warn(`${service.name}: ${configPath} is not valid yaml`);
    return;
  }

  const template = flatten(await readYaml(templatePath));
  for (const [key, value] of Object.entries(template)) {
    if (config[key] !== value) {
      warn(
        `${service.name}: '${key}' should be '${value}' (is '${config[key]}')`,
      );
    }
  }
};

const copyConfigs = async (reposDir: string) => {
  for (const service of SERVICES) {
    const repoPath = join(reposDir, service.repo);
    if (!(await exists(repoPath))) continue;

    const configPath = join(repoPath, service.config);
    const templatePath = join(ROOT, "configs", `${service.name}.yml`);

    if (await exists(configPath)) {
      await checkConfig(service, configPath, templatePath);
      continue;
    }

    await Deno.mkdir(dirname(configPath), { recursive: true });
    await Deno.copyFile(templatePath, configPath);

    ok(`${service.name}: config created`);
  }
};

await checkRequirements();
const env = await loadEnv();
const reposDir = getReposDir(env);

await copyConfigs(reposDir);

console.log(`
Ready! Next steps:
  1. deno task dev:up auth
  2. deno task dev:seed
  3. deno task dev:up
`);
