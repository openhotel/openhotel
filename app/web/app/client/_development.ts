import { join, basename, dirname } from "@std/path";

const doFolderThing = (path: string) => {
  let currentFiles = [];

  for (const dirEntry of Deno.readDirSync(path)) {
    if (dirEntry.name === "index.ts") continue;

    const currentPath = join(path, dirEntry.name);
    if (currentPath.includes("~")) continue;

    if (dirEntry.isDirectory) {
      doFolderThing(currentPath);
    }
    currentFiles.push(currentPath);
  }
  if (PATHS.some((paths) => path.endsWith(paths))) return;

  const indexPath = join(path, "index.ts");

  currentFiles = currentFiles.map((path) => basename(path)).sort();

  const dashes =
    "////////////////////////////////////////////////////////////////////////////////";

  let files = currentFiles.filter((path) => path.includes("."));
  const folders = currentFiles.filter((path) => !path.includes("."));

  //filter out files including "///PREVENT_INDEX"
  files = files.filter(
    (filePath) =>
      !Deno.readTextFileSync(join(path, filePath)).includes("///PREVENT_INDEX"),
  );

  Deno.writeTextFileSync(
    indexPath,
    `${dashes}\n///AUTO-GENERATED///////////////////////////////////////////////////////////////\n${dashes}\n` +
      folders.map((path) => `export * from "./${path}";`).join("\n") +
      (files.length && folders.length ? `\n${dashes}\n` : "") +
      files.map((path) => `export * from "./${path}";`).join("\n") +
      `\n${dashes}\n`,
  );
};

const PATHS = ["/modules", "/shared"];

for (const path of PATHS.map((path) => `./src${path}`)) {
  doFolderThing(path);
}

const watcher = Deno.watchFs("src", { recursive: true });

for await (const event of watcher) {
  if (
    event.kind === "modify" ||
    event.kind === "create" ||
    event.kind === "remove" ||
    event.kind === "rename"
  ) {
    for (const path of event.paths.filter(
      (path) =>
        basename(path) !== "index.ts" &&
        PATHS.some((paths) => path.includes(paths)) &&
        !PATHS.some((paths) => path.endsWith(paths)),
    )) {
      doFolderThing(dirname(path));
    }
  }
}
