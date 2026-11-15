import {
  configure,
  BlobReader,
  ZipReader,
  ZipWriter,
  BlobWriter,
  Uint8ArrayWriter,
} from "@zip-js";
import { createDirectoryIfNotExists } from "../utils/directory.utils.ts";
import { join } from "@std/path";

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
