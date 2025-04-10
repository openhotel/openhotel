import { parseArgs } from "@std/cli/parse-args";
import { getBeautyDate } from "@oh/utils";

const VALID_TARGET_LIST = [
  "x86_64-unknown-linux-gnu",
  "aarch64-unknown-linux-gnu",
  "x86_64-apple-darwin",
  "x86_64-pc-windows-msvc",
];

const log = (message: string, color = "#FFFFFF") => {
  console.log(
    `%c${getBeautyDate()} | %c${message}`,
    `color: #666666`,
    `color: ${color}`,
  );
};

log(`Welcome to Open Hotel Build Process!`);

try {
  log(`Cleaning old build...`, "gray");
  await Deno.remove("./build", {
    recursive: true,
  });
} catch (_) {}

let { version, target, client, server, zip, debug, release } = parseArgs(
  Deno.args,
);

if (target && target !== "*" && !VALID_TARGET_LIST.includes(target))
  throw `Target '${target}' is not valid!`;

const $targets = !target
  ? [Deno.build.target]
  : target === "*"
    ? VALID_TARGET_LIST
    : [target];

log(
  `Target${$targets.length > 1 ? "s" : ""}: ${$targets.join(", ")}`,
  "yellow",
);

if (!version) version = `1.0.0`;

log(`Version: ${version}`, "yellow");

const commandInstall = new Deno.Command(Deno.execPath(), {
  args: ["task", "install"],
  // stdout: debug ? "inherit" : "piped",
});
const installChild = await commandInstall.spawn();

if (!(await installChild.status).success)
  throw new Error("Install had an error!");

const outputPath = "../../build";

const compileAll = !client && !server;

//client build
if (compileAll || client) {
  log(`Client - Compiling...`, "gray");

  const clientPath = "./app/client";
  const $permanentViteConfigPath = `${clientPath}/vite.config.ts`;
  const $temporalViteConfigPath = `${clientPath}/$vite.config.ts`;

  try {
    log(`Server - Removing old $vite.config.ts`, "gray");
    await Deno.remove($temporalViteConfigPath);
  } catch (_) {}

  const viteConfigFileText = await Deno.readTextFile($permanentViteConfigPath);
  log(`Server - Generating $vite.config.ts`, "gray");
  await Deno.writeTextFile(
    $temporalViteConfigPath,
    viteConfigFileText.replace("__VERSION__", version),
  );

  const command = new Deno.Command(`vite`, {
    args: ["build", `--config=$vite.config.ts`],
    cwd: clientPath,
    stdout: debug ? "inherit" : "piped",
  });
  const child = command.spawn();

  if (!(await child.status).success)
    throw new Error("Client - Build had an error!");
  log(`Client - Build was successful!`, "green");

  try {
    await Deno.remove($temporalViteConfigPath);
  } catch (_) {}
}

//server build
if (compileAll || server) {
  const serverPath = "./app/server";
  const $permanentModPath = `${serverPath}/mod.ts`;
  const $temporalModPath = `${serverPath}/$mod.ts`;

  try {
    log(`Server - Removing old $mod.ts`, "gray");
    await Deno.remove($temporalModPath);
  } catch (_) {}

  const serverMod = (await Deno.readTextFile($permanentModPath))
    .replace("__VERSION__", version)
    .replace(`"__UPGRADE__"`, Boolean(release) ? "true" : "false");

  log(`Server - Moving assets...`, "gray");
  async function copyDir(src: string, dest: string) {
    // Create the destination directory if it doesn't exist
    try {
      await Deno.mkdir(dest, { recursive: true });
    } catch (err) {
      return;
    }

    for await (const entry of Deno.readDir(src)) {
      const srcPath = `${src}/${entry.name}`;
      const destPath = `${dest}/${entry.name}`;

      if (entry.isDirectory) {
        await copyDir(srcPath, destPath);
      } else if (entry.isFile) {
        try {
          await Deno.copyFile(srcPath, destPath);
          log(`Server - Copying ${srcPath} -> ${destPath}`, "gray");
        } catch (err) {
          log(`Server - Error moving ${srcPath} -> ${destPath}!`, "red");
        }
      }
    }
  }

  await copyDir(`${serverPath}/assets`, "./build/assets");

  log(`Server - Generating $mod.ts`, "gray");
  await Deno.writeTextFile($temporalModPath, serverMod);

  if (zip) Deno.mkdir("./build/zips");

  for (const $target of $targets) {
    log(`Server - Compiling target '${$target}'...`, "gray");

    const [arch, , os] = $target.split("-");

    const $targetName = `server_${os}${arch === "aarch64" ? "_aarch64" : ""}`;

    const command = new Deno.Command(Deno.execPath(), {
      args: [
        "compile",
        "-A",
        "--unstable-kv",
        "--no-check",
        "--include=./src/shared/workers.ts",
        `--target=${$target}`,
        `--output=${outputPath}/${$targetName}`,
        "./$mod.ts",
      ],
      cwd: serverPath,
      stdout: debug ? "inherit" : "piped",
    });
    let child = command.spawn();

    if (!(await child.status).success)
      throw new Error("Server - Build had an error!");
    log(`Server - Build was successful!`, "green");

    if (zip) {
      log(`Server - Zipping ${$targetName}.zip...`);
      console.log(
        VALID_TARGET_LIST.filter((target) => $target !== target)
          .map(
            (target) =>
              `"${target}${target.includes("windows") ? ".exe" : ""}"`,
          )
          .join(" "),
      );
      const zipCommand = new Deno.Command(`zip`, {
        args: [
          "-r",
          `./zips/${$targetName}.zip`,
          ".",
          "-i",
          $targetName + (os.includes("windows") ? ".exe" : ""),
          "./assets/*",
          "./client/*",
          "-x",
          "zips/*",
        ],
        cwd: "./build",
        stdout: debug ? "inherit" : "piped",
      });
      child = zipCommand.spawn();

      if (!(await child.status).success)
        throw new Error("Server - Zip had an error!");
      log(`Server - Zip was successful!`, "green");
    }
  }

  try {
    await Deno.remove($temporalModPath);
  } catch (_) {}
}

log(`Done!`, "#FFFFFF");
