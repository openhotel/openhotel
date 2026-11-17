import {
  Uint8ArrayReader,
  Uint8ArrayWriter,
  ZipReader,
  configure,
  BlobReader,
  ZipWriter,
  BlobWriter,
} from "@zip-js";
import { dirname, join } from "@std/path";
import { createDirectoryIfNotExists } from "@shared/utils/directory.utils.ts";

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
    const $path = join(path, entry.filename);
    if (entry.directory) {
      await Deno.mkdir($path, { recursive: true });
      continue;
    }
    await Deno.mkdir(dirname($path), { recursive: true });
    const data = await entry.getData!(new Uint8ArrayWriter());
    await Deno.writeFile($path, data, { mode: 0o755 });
  }

  await reader.close();
  return [...roots];
};

const initConfigure = () => {
  //prevent use web workers
  configure({ useWebWorkers: false });
};

export const decompress = async (
  srcPath: string,
  destPath: string,
): Promise<void> => {
  initConfigure();

  const file = await Deno.readFile(srcPath);

  const blob = new Blob([file]);
  const blobReader = new BlobReader(blob);
  const zipReader = new ZipReader(blobReader);

  for (const file of await zipReader.getEntries()) {
    const content = await file.getData(new Uint8ArrayWriter());
    const fileDir = destPath + "/" + file.filename;
    await createDirectoryIfNotExists(fileDir);

    await Deno.writeFile(fileDir, content);
  }
};

export const compressDir = async (
  srcPath: string,
  destPath: string,
  password?: string,
): Promise<void> => {
  initConfigure();

  const blobWriter = new BlobWriter();
  const zipWriter = new ZipWriter(blobWriter, {
    password,
  });

  const addFilesToZip = async (
    path: string,
    zipWriter: ZipWriter,
    relativePath: string = "",
  ): Promise<void> => {
    for await (const entry of Deno.readDir(path)) {
      const fullPath = join(path, entry.name);
      const entryRelativePath = join(relativePath, entry.name);

      if (entry.isDirectory) {
        await addFilesToZip(fullPath, zipWriter, entryRelativePath);
      } else if (entry.isFile) {
        const fileData = await Deno.readFile(fullPath);
        await zipWriter.add(entryRelativePath, new Uint8Array(fileData));
      }
    }
  };

  await addFilesToZip(srcPath, zipWriter);

  await zipWriter.close();

  const compressedBlob = await blobWriter.getData();
  const compressedData = new Uint8Array(await compressedBlob.arrayBuffer());
  await Deno.writeFile(destPath, compressedData);
};

export const compressFiles = async (
  files: string[],
  destPath: string,
  password?: string | null,
): Promise<void> => {
  initConfigure();

  const blobWriter = new BlobWriter();
  const zipWriter = new ZipWriter(blobWriter, {
    password,
    encryptionStrength: password ? 3 : 1,
  });

  for (const file of files) {
    try {
      const fileData = await Deno.readFile(file);
      const fileName = file.split("/").pop() || file; // Get the filename
      await zipWriter.add(fileName, new BlobReader(new Blob([fileData])));
    } catch (e) {}
  }

  await zipWriter.close();

  const compressedBlob = await blobWriter.getData();
  const compressedData = new Uint8Array(await compressedBlob.arrayBuffer());
  await Deno.writeFile(destPath, compressedData);
};
