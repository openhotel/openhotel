import { exists, expandGlob } from "@std/fs";
import { join, relative } from "@std/path";
import {
  getReposDir,
  loadEnv,
  ok,
  readYaml,
  ROOT,
  SERVICES,
  warn,
} from "./utils.ts";

const SKIP_CONFIRM = Deno.args.includes("--yes");
const RESET_CONFIGS = Deno.args.includes("--configs");
const RESET_CACHE = Deno.args.includes("--cache");

const docker = async (...args: string[]): Promise<boolean> => {
  try {
    const { success } = await new Deno.Command("docker", {
      args,
      cwd: ROOT,
      stdout: "null",
      stderr: "null",
    }).output();

    return success;
  } catch {
    return false;
  }
};

const getPaths = async (reposDir: string): Promise<string[]> => {
  const paths: string[] = [];

  for (const service of SERVICES) {
    const repoPath = join(reposDir, service.repo);
    if (!(await exists(repoPath))) continue;

    const patterns = [
      ...service.data,
      ...(RESET_CONFIGS ? [service.config] : []),
    ];

    for (const pattern of patterns) {
      for await (const { path } of expandGlob(join(repoPath, pattern))) {
        paths.push(path);
      }
    }
  }

  return paths;
};

const reposDir = getReposDir(await loadEnv());
const { name: project } = await readYaml<{ name: string }>(
  join(ROOT, "compose.yml"),
);
const volumes = ["s3-data", ...(RESET_CACHE ? ["deno-cache"] : [])];
const paths = await getPaths(reposDir);

console.log(`This will remove:
  - containers and their node_modules
  - docker volumes: ${volumes.join(", ")}
${paths.map((path) => `  - ${relative(reposDir, path)}`).join("\n")}
`);

if (!SKIP_CONFIRM && !confirm("Continue?")) Deno.exit(0);

const containersRemoved = await docker(
  "compose",
  "rm",
  "--stop",
  "--force",
  "--volumes",
);

const networkRemoved = await docker("compose", "down");

if (containersRemoved && networkRemoved) {
  ok("containers removed");
} else {
  warn("containers could not be removed");
}

for (const volume of volumes) {
  const name = `${project}_${volume}`;

  const volumeExists = await docker("volume", "inspect", name);
  if (!volumeExists) continue;

  const volumeRemoved = await docker("volume", "rm", name);
  if (volumeRemoved) ok(`volume ${volume} removed`);
  else warn(`volume ${volume} could not be removed`);
}

for (const path of paths) {
  try {
    await Deno.remove(path, { recursive: true });
    ok(`${relative(reposDir, path)} removed`);
  } catch (e) {
    warn(`${relative(reposDir, path)} could not be removed: ${e}`);
  }
}

console.log(`
Done! Next steps:${RESET_CONFIGS ? "\n  0. deno task setup" : ""}
  1. deno task up auth
  2. deno task seed
  3. deno task up
`);
