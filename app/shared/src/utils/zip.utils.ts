import { Uint8ArrayReader, Uint8ArrayWriter, ZipReader } from "@zip-js/zip-js";
import { dirname, join } from "@std/path";

export const replaceFilesAndFoldersFromZip = async (
  zipBytes: Uint8Array,
  path: string,
) => {
  const reader = new ZipReader(new Uint8ArrayReader(zipBytes));
  const entries = await reader.getEntries();

  // top-level names inside the zip (files and folders)
  const roots = new Set(
    entries.map(({ filename }) => filename.split("/")[0]).filter(Boolean),
  );

  // delete files/folders
  // deleting the running binary works on linux
  for (const name of roots) {
    await Deno.remove(join(path, name), { recursive: true }).catch((e) => {
      if (!(e instanceof Deno.errors.NotFound)) throw e;
    });
  }

  // unzip
  for (const entry of entries) {
    const path = join(path, entry.filename);
    if (entry.directory) {
      await Deno.mkdir(path, { recursive: true });
      continue;
    }
    await Deno.mkdir(dirname(path), { recursive: true });
    const data = await entry.getData!(new Uint8ArrayWriter());
    await Deno.writeFile(path, data, { mode: 0o755 });
  }

  await reader.close();
  return [...roots];
};
