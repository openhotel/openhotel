import { configure, BlobReader, ZipReader, Uint8ArrayWriter } from "@zip-js";
import { createDirectoryIfNotExists } from "../utils/directory.utils.ts";

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

//TODO function not checked
// export const compress = async (srcPath: string, destPath: string) => {
//   initConfigure();
//
//   const blobWriter = new BlobWriter();
//   const zipWriter = new ZipWriter(blobWriter);
//
//   const addFilesToZip = async (path: string, zipWriter: ZipWriter, relativePath: string = "") => {
//     for await (const entry of Deno.readDir(path)) {
//       const fullPath = join(path, entry.name);
//       const entryRelativePath = join(relativePath, entry.name);
//
//       if (entry.isDirectory) {
//         await addFilesToZip(fullPath, zipWriter, entryRelativePath);
//       } else if (entry.isFile) {
//         const fileData = await Deno.readFile(fullPath);
//         await zipWriter.add(entryRelativePath, new Uint8Array(fileData));
//       }
//     }
//   };
//
//   await addFilesToZip(srcPath, zipWriter);
//
//   await zipWriter.close();
//
//   const compressedBlob = await blobWriter.getData();
//   const compressedData = new Uint8Array(await compressedBlob.arrayBuffer());
//   await Deno.writeFile(destPath, compressedData);
// }
